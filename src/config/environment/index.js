const path = require('path');
const dotenv = require('dotenv');
const _ = require('lodash');

const root = path.normalize(`${__dirname}/../../..`);
const env = dotenv.config({ path: path.join(root, '.env') });
const logging = env.NODE_ENV === 'development';

const all = {
  env: process.env.NODE_ENV,
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  ip: process.env.IP || '0.0.0.0',
  DB_URL: process.env.DB_URL,
  DOMAIN: process.env.DOMAIN,
  JWT_KEY: process.env.JWT_KEY,
  SALT: process.env.SALT,
  inventory: {
    username: process.env.INVENTORY_MYSQL_USER,
    password: process.env.INVENTORY_MYSQL_PASS,
    database: process.env.INVENTORY_MYSQL_DB,
    host: process.env.INVENTORY_MYSQL_HOST,
    dialect: 'mysql',
    logging,
    timezone: '+05:30',
    dialectOptions: {
      charset: 'utf8mb4',
    },
  },
};

module.exports = _.merge(
  all,
  env,
);
