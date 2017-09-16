'use strict';
// var express = require('express');
// var router = express.Router();

var ZiWordRoutes = function(app){
    var ziWordController = require('../controllers/ziWordController');
    console.log('add routes.');
    app.route('/letters/:letter').get(ziWordController.get_zi_word);
    //app.get('/letters/:letter', ziWordController.get_zi_word);
    app.route('/books/books').get(ziWordController.get_book_list);
};
module.exports = ZiWordRoutes;