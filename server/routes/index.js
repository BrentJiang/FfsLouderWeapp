'use strict';

const express = require('express');
const router = express.Router();
const ziWordController = require('./../controllers/ziWordController');

router.get('/', require('./welcome'));
router.get('/login', require('./login'));
router.get('/user', require('./user'));
router.get('/letter/:letter', ziWordController.get_zi_word);
router.all('/tunnel', require('./tunnel'));

module.exports = router;