'use strict';

//
var resolve = require('path').resolve
// resolve('../../bb/tmp.txt')

const express = require('express');
const router = express.Router();

var ziWordController = require(resolve('./routes/controllers/ziWordController'));
console.log("controller path: " + resolve('./routes/controllers/ziWordController'))

router.get('/', require('./welcome'));
router.get('/login', require('./login'));
router.get('/user', require('./user'));
router.get('/letter/:letter', ziWordController.get_zi_word);
router.all('/tunnel', require('./tunnel'));

module.exports = router;