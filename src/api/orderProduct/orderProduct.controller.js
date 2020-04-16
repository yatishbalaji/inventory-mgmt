const moment = require('moment');

const logger = require('../../components/logger');
import db, {
  Wallet, DiscountPackage, ClientDiscountPackage, UserDetailView, Client,
  InvoiceSubscription,
} from '../../sqldb';
const config = require('../../config/environment');
const ses = require('../../conn/ses');

async function walletEmail(walletDetails) {
  try {
    const [clientData, packageName, user] = await Promise.all([
      Client.findOne({
        attributes: ['id', 'name', 'bd_mgr_id'],
        where: { id: walletDetails.clientId },
        raw: true,
      }),
      DiscountPackage.findOne({
        attributes: ['name'],
        where: { id: walletDetails.discountPackageId },
        raw: true,
      }),
      UserDetailView.findOne({
        attributes: ['user_name'],
        where: { user_id: walletDetails.userId },
        raw: true,
      }),
    ]);

    const BDdata = await UserDetailView.findOne({
      attributes: ['user_email'],
      where: { user_id: clientData.bd_mgr_id },
      raw: true,
    });

    const ccaddress = [];
    ccaddress.push(config.WALLET_EMAIL);
    if (BDdata && BDdata.user_email) ccaddress.push(BDdata.user_email);

    return ses.sendTemplatedEmail({
      Source: `"QuezX.com" <${config.SMTP_USER}>`,
      Destination: {
        ToAddresses: [walletDetails.email],
        CcAddresses: ccaddress,
        BccAddresses: [config.BCC_EMAIL],
      },
      Template: 'trans-new_m-wallet-added',
      TemplateData: JSON.stringify({
        name: user.user_name,
        clientName: clientData && clientData.name,
        package: packageName && packageName.name,
        subject: `Wallet Amount Credited to - ${clientData.name}`,
      }),
    });
  } catch (err) {
    return logger.error(err);
  }
}

export async function index(req, res, next) {
  try {
    const [wallet, balance] = await Promise.all([
      Wallet.findAll({
        attributes: [
          'description', 'amount', 'created_on',
        ],
        where: { client_id: req.user.client_id },
        limit: +req.query.limit || 10,
        offset: +req.query.offset || 0,
        order: [['created_on', 'DESC']],
      }),
      Wallet.sum('amount', {
        where: {
          deleted_on: null,
          client_id: req.user.client_id,
        },
      }),
    ]);

    return res.json({ wallet, balance });
  } catch (err) {
    return next(err);
  }
}

export async function create(req, res, next) {
  try {
    const { description, client_id: cid, discountPackageId } = req.body;

    const discountPackage = await DiscountPackage.findOne({
      attributes: ['amount', 'validity'],
      where: { id: discountPackageId },
    });

    const discount = await ClientDiscountPackage.create({
      client_id: cid,
      discount_package_id: discountPackageId,
      balance: discountPackage.amount,
      start_date: moment(),
      expiry_date: moment().add(discountPackage.validity, 'd').endOf('day'),
    });

    Wallet.create({
      amount: discountPackage.amount,
      description,
      client_discount_package_id: discount.id,
      client_id: cid,
      created_by: req.user.id,
    });

    const walletDetails = {
      userId: req.user.id,
      email: req.user.email_id,
      clientId: cid,
      discountPackageId,
    };

    walletEmail(walletDetails);

    const data = {
      client_id: cid,
      quezx_service_id: 2,
      duration: discountPackage.validity,
      start_date: moment(),
      end_date: moment().add(discountPackage.validity, 'd').endOf('day'),
      amount: discountPackage.amount,
      status: 1,
      created_by: req.user.id,
    };

    const subscription = await InvoiceSubscription.createInvoiceSubscription(db, data);

    return res.json(subscription);
  } catch (err) {
    return next(err);
  }
}

export async function history(req, res, next) {
  try {
    const data = await Wallet.findAll({
      attributes: ['amount', 'client_discount_package_id', 'description'],
      where: { client_id: req.query.client_id },
      order: [['created_on', 'DESC']],
      include: [{
        model: ClientDiscountPackage,
        attributes: ['discount_package_id', 'balance', 'start_date', 'expiry_date'],
      }],
    });

    return res.json(data);
  } catch (err) {
    return next(err);
  }
}
