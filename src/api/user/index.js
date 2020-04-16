const express = require('express');
const controller = require('./user.controller');
const authenticate = require('../../components/authenticate');

const router = express.Router();

router.get('/', controller.index);

router.post('/login', controller.login);
router.post('/', authenticate, controller.create);

module.exports = router;
