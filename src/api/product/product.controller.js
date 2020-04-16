const { Product } = require('../../sqldb');

const index = async (req, res, next) => {
  try {
    const { sort = 'name', order = 'ASC', page = 1 } = req.query;

    const data = await Product.findAll({
      attributes: ['id', 'name', 'qty', 'amount'],
      limit: 10,
      offset: page * 10,
      order: sort !== 'undefined' ? [[sort, order]] : [],
    });

    return res.json(data);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  index,
}