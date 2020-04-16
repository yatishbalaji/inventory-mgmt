const { Product, Order, OrderProduct, Sequelize, inventory } = require('../../sqldb');

const index = async (req, res, next) => {
  try {
    const data = await Product.findAll();

    return res.json({ data});
  } catch (err) {
    return next(err);
  }
}

const create = async (req, res, next) => {
  try {
    let { cartProducts } = req.body;

    const t = await inventory.transaction({
      autocommit: false,
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
      type: Sequelize.Transaction.TYPES.IMMEDIATE
    });

    const products = await Product.findAll({
      attributes: ['id', 'amount', 'qty'],
      where: {
        id: cartProducts.map(o => o.id),
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    }).then(data => data.reduce((acc, d) => (
      Object.assign(acc, { [d.id]: d })
    ), {}));

    const expiredProducts = cartProducts.filter(o => o.oQty > products[o.id].qty);

    if (!expiredProducts.length) {
      await Product.bulkCreate(cartProducts.map(o => ({
        id: o.id,
        qty:  products[o.id].qty - o.oQty
      })), {
        updateOnDuplicate: [
          'qty',
        ],
        transaction: t,
      });
    }

    let totalAmt = 0;
    cartProducts = cartProducts.map(o => {
      const amount = products[o.id].amount * o.oQty;
      totalAmt = totalAmt + amount;
      return {
        product_id: o.id,
        amount,
        qty: o.oQty,
      };
    });

    const data = await Order.create({
      amount: totalAmt,
      status: expiredProducts.length ? 'FAILED' : 'SUCCESS',
      OrderProducts: cartProducts,
      created_by: 1,
    }, {
      include: [{
        model: OrderProduct,
      }],
      transaction: t,
    });

    await t.commit();

    if (expiredProducts.length) {
      return res.status(404).json({
        message: `Desired quantities seems to be out of stock for: ${expiredProducts.map(x => x.name).join(', ')}`
      });
    }

    return res.json({ data });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).json({
      message: 'Something went wrong.'
    });
  }
}

module.exports = {
  index,
  create,
}