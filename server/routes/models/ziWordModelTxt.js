'use strict';

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./routes/data/chineseLetters.txt')
  });
var chineseDict = {};
var chineseLetterCounter = 0;  
lineReader.on('line', function (line) {
    //console.log('Line from file:', line);
    var letter = line.charAt(0);
    var itemval = {
        "id": ++chineseLetterCounter,
        "letter": letter,
        "Interpretation": line.substr(2)
    };
    if(chineseLetterCounter<10){
        console.log(line);
    }else{
        //return; // for test
    }
    chineseDict[letter] = itemval;
});
  
console.log('after calling readFile chineseLetters.txt');

var ZiWord = {

    getZiWord:function(letter, callback){        
        console.log('query from txt: ' + letter);
        if(letter in chineseDict){
            console.log("find it!");
            callback(null, [chineseDict[letter]]);
        }else{
            console.log("not found!");
            callback({"result": "not found."}, null);
        }
    },
    getBookList:function(callback){
        callback({
            "books":[
                {
                    "Title":"资治通鉴",
                    "Author":"司马光",
                    "Notes":[
                        {"Title":"第一纪","NoteId":"view_318"},
                        {"Title":"第一纪","NoteId":"view_319"},
                    ]
                },               
                {
                    "Title":"孙子兵法",
                    "Author":"孙膑",
                    "Notes":[
                        {"Title":"第一纪","NoteId":"view_518"},
                        {"Title":"第一纪","NoteId":"view_519"},
                    ]
                }

            ]
        });
    }
};
module.exports = ZiWord;