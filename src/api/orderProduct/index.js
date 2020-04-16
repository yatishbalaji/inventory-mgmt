const express = require('express');
const controller = require('./order.controller');

const router = express.Router();
router.get('/', controller.index);
router.get('/history', controller.history);

router.post('/', controller.create);

module.exports = router;
