import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { merge, Observable, of as observableOf, fromEvent, Subject, throwError } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements AfterViewInit {
  homeFormGroup: FormGroup;
  inventoryDatabase: InventoryHttpDatabase | null;
  isLoadingResults: boolean = true;
  resultsLength: number = 0;
  data: any[];
  displayedColumns: string[] = [
    'id', 'name', 'qty', 'amount', 'oQty'
  ];
  clickStream = new Subject();
  inventorySource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort

  constructor(
    private _httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.homeFormGroup = new FormGroup({
      // id: new FormControl(null, [Validators.required]),
      id: this.formBuilder.array([])
    });
  }

  ngAfterViewInit() {
    this.inventoryDatabase = new InventoryHttpDatabase(this._httpClient);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.clickStream.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page, this.clickStream)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.inventoryDatabase.getInventories(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
          );
        }),
        map(data => {
          this.isLoadingResults = false;
          this.resultsLength = data.length;
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => {
        this.inventorySource.data = data;

        this.homeFormGroup = this.formBuilder.group({
          memberDetails: this.formBuilder.array(
            data.map(x => this.formBuilder.group({
              oQty: [0, [Validators.required]],
            }))
          ),
          id: this.formBuilder.array([])
        })
      });
  }

  showError(msg) {
    this.snackBar.open(msg, null, {
      duration: 2000,
    });
  }

  onChange(event, i) {
    const ids = <FormArray>this.homeFormGroup.get('id') as FormArray;

    if(event.checked) {
      ids.push(new FormControl(event.source.value))
    } else {
      const i = ids.controls.findIndex(x => x.value === event.source.value);
      ids.removeAt(i);
    }

    this.inventorySource.data[i] = Object.assign(this.inventorySource.data[i], {
      checked: event.checked,
    })
    console.log(ids);
  }

  onXChange(i, oQty) {
    this.inventorySource.data[i] = Object.assign(this.inventorySource.data[i], {
      oQty: +oQty,
    })
  }

  onSubmit() {
    const result = this.inventorySource.data
      .filter((x) => x.checked)
    if (!result.length) return;

    this.isLoadingResults = true;
    this._httpClient.post(`/api/order`, {
      cartProducts: result,
    })
      .pipe(
        map(res => res),
        catchError((err) => throwError(err))
      )
      .subscribe(
        () => {
          this.isLoadingResults = false;
          this.showError('Order Placed successfully');
        },
        (err) => {
          this.isLoadingResults = false;
          this.showError(err.error.message);
        }
      );
  }
}

export class InventoryHttpDatabase {
  headers: HttpHeaders = new HttpHeaders();

  constructor(private _httpClient: HttpClient) { }

  getInventories(
    sort: string, order: string, page: number
  ): Observable<any> {
    const href = '/api/product';
    const requestUrl =
      `${href}?sort=${sort}&order=${order}&page=${page}`;

    return this._httpClient.get<any>(requestUrl);
  }
}