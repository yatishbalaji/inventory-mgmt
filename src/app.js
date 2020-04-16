const express = require('express');
const http = require('http');

const config = require('./config/environment');
const logger = require('./components/logger');
const db = require('./sqldb');

const app = express();
const server = http.createServer(app);

require('./config/express')(app);
require('./routes')(app);

function connect() {
  return db.inventory.authenticate()
      .then(x => console.log(x) && x)
      .catch(err => error('Error starting', err));
}

function startServer() {
  server.listen(config.port, config.ip, () => {
    logger.debug(`New Server listening on ${config.port}, in ${app.get('env')} mode`);
  });
}

process.on('unhandledRejection', (reason, p) => {
  logger.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  logger.error('uncaughtException', err);
});

app.loadComplete = connect().then(startServer);

// Expose app
module.exports = app;
