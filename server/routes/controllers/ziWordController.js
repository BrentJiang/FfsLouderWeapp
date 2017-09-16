'use strict';
var resolve = require('path').resolve
//resolve('../../bb/tmp.txt')

var ZiWord = require(resolve('./routes/models/ZiWordModel'));
console.log("ziwordpath: " + resolve('./routes/models/ZiWordModel'));

var _Hash_OnLineNum_IP_UID = {};//缓冲各个IP的UID,格式: _Hash_OnlineNum_IP[IP]=UID
var _Hash_OnLineNum_IP_Num = {};//缓冲各个IP的请求数,格式: _Hash_OnlineNum_IP[IP]=int


var Controller = {
    get_zi_word: function(req, res) {
        console.log(req.ip);
        if(!CheckOnLineNum(req)){
            //res.json("已超出访问限制！");
            res.json([]);
            return;
        }
        //res.send('GET request to the homepage');
        ZiWord.getZiWord(req.params.letter, function (err, rows) {
            if (err) {
                // Node.js: printing to console without a trailing newline? https://stackoverflow.com/questions/6157497/node-js-printing-to-console-without-a-trailing-newline
                // process.stdout.write("hello: ");
                console.log("error: " + err);
                res.json(err);
            }
            else {
                //onsole.log("find "+rows+" from model.");
                res.json(rows);
            }
        });
    },
    get_book_list: function(req, res) {
        console.log('GET request to books');
        ZiWord.getBookList(function (rows) {
            res.json(rows);
        });
    }
};

module.exports = Controller;

function CheckOnLineNum(req) {
    if(!_Hash_OnLineNum_IP_Num.hasOwnProperty(req.ip)) {
        _Hash_OnLineNum_IP_Num[req.ip] = 1;
    }else{
        _Hash_OnLineNum_IP_Num[req.ip] = _Hash_OnLineNum_IP_Num[req.ip] + 1;
    }

    if(parseInt(_Hash_OnLineNum_IP_Num[req.ip]) > 12){
        return false;
    }
    return true;
}