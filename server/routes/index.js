'use strict';


const express = require('express');
const router = express.Router();

router.get('/', require('./welcome'));
router.get('/login', require('./login'));
router.get('/user', require('./user'));
router.get('/letter/:letter/:openid', require('./chinesedict').get_zi_word);
router.all('/tunnel', require('./tunnel'));
router.get('/books/:startIndex', require('./books').get_books);

module.exports = router;