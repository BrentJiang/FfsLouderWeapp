'use strict';

var db = require('../../dbconnection'); //reference of dbconnection.js

var ZiWord = {

    getZiWord:function(letter,callback){        
        console.log('query from db: ' + letter);
        return db.query("select * from ffslouder.zi_word where zi_word.letter=?;", [letter], callback);
    },
    getBookList:function(callback){
        return 
    }
};
module.exports = ZiWord;