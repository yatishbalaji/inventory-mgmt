# Inventory App
Inventory Management

#### Technologies used
    - NodeJS
    - MySQL
    - Express
    - SequelizeJs

Installation
----------------------

Clone repository

    https://github.com/yatishbalaji/inventory-mgmt.git

    npm install

    npm run start

## Usage

Visit http://localhost:5000

Admin Login http://localhost:5000/login

## Concurrency Testing
`cat my_data.json`
```
{"cartProducts":[{"id":1,"oQty":10},{"id":2,"oQty":3}]}
```
### Using Apache Benchmark
```
ab -p my_data.json -T application/json -H 'Authorization: Token abcd1234' -c 5 -n 10 http://localhost:5000/api/order
```

