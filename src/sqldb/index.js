/**
 * Sequelize initialization module
 */

const Sequelize = require('sequelize');
const _ = require('lodash');

const config = require('../config/environment');

const logging = config.NODE_ENV === 'development';

const v5 = {
  dialectOptions: {
    decimalNumbers: true,
  },
  define: {
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci',
    },
  },
  pool: {
    max: 5,
    min: 1,
    acquire: 60000,
    idle: 30000,
  },
};

const params = _.omit(config.inventory, ['username', 'password', 'host', 'database']);

const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col,
};

const db = {
  Sequelize,
  inventory: new Sequelize(config.inventory.database, config.inventory.username, config.inventory.password, {
    host: config.inventory.host,
    ...v5,
    ...params,
    operatorsAliases,
    logging,
  }),
};

const databases = {
  inventory: [
    'User', 'Product',
    'Order', 'OrderProduct'
  ],
};

Object
  .keys(databases)
  .forEach(dbname => databases[dbname]
    .forEach((model) => {
      db[model] = db[dbname]
        .import(`../api/${_.camelCase(model)}/${_.camelCase(model)}.model`);
    }));

Object.keys(db).forEach((modelName) => {
  if ('associate' in (db[modelName].options.classMethods || {})) {
    db[modelName].options.classMethods.associate(db);
  }
});

module.exports = db;
