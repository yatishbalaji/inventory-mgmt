const path = require('path')
const { name, version } = require('../package.json');
const { NODE_ENV } = require('./config/environment');
const logger = require('./components/logger');
const UserRoute = require('./api/user');
const OrderRoute = require('./api/order');
const ProductRoute = require('./api/product');

const authenticate = require('./components/authenticate');

module.exports = (app) => {
  // Insert routes below
  app.get('/health', (req, res) => {
    return res.json({ name, version });
  });

  app.use('/api/user', UserRoute);
  app.use('/api/order', authenticate, OrderRoute);
  app.use('/api/product', authenticate, ProductRoute);

  app.use((e, req, res, next) => {
    console.error(e);
    return (res.status(e.statusCode || e.code || 500)
      .json({
        message: e.message,
        stack: NODE_ENV === 'development' ? e.stack : {},
      }));
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });
};
