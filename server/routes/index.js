'use strict';

//
var resolve = require('path').resolve
// resolve('../../bb/tmp.txt')

const express = require('express');
const router = express.Router();

var datapath = resolve('./routes/data/chineseLetters.txt');
console.log("data path: " + datapath);
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(datapath)
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
  if (chineseLetterCounter < 10) {
    console.log(line);
  } else {
    //return; // for test
  }
  chineseDict[letter] = itemval;
});

console.log('after calling readFile chineseLetters.txt');

var _Hash_OnLineNum_IP_UID = {};//缓冲各个IP的UID,格式: _Hash_OnlineNum_IP[IP]=UID
var _Hash_OnLineNum_IP_Num = {};//缓冲各个IP的请求数,格式: _Hash_OnlineNum_IP[IP]=int

function CheckOnLineNum(req) {
  if (!_Hash_OnLineNum_IP_Num.hasOwnProperty(req.ip)) {
    _Hash_OnLineNum_IP_Num[req.ip] = 1;
  } else {
    _Hash_OnLineNum_IP_Num[req.ip] = _Hash_OnLineNum_IP_Num[req.ip] + 1;
  }

  if (parseInt(_Hash_OnLineNum_IP_Num[req.ip]) > 12) {
    return false;
  }
  return true;
}

function getZiWord(letter, callback) {
  console.log('query from txt: ');
  console.log(letter);
  if (letter in chineseDict) {
    console.log("find it!");
    callback(null, [chineseDict[letter]]);
  } else {
    console.log("not found!");
    callback({ "result": "not found." }, null);
  }
};

function get_zi_word(req, res) {
  console.log(req.ip);
  if (!CheckOnLineNum(req)) {
    //res.json("已超出访问限制！");
    res.json([]);
    return;
  }
  //res.send('GET request to the homepage');
  getZiWord(req.params.letter, function (err, rows) {
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
}

router.get('/', require('./welcome'));
router.get('/login', require('./login'));
router.get('/user', require('./user'));
router.get('/letter/:letter', get_zi_word);
router.all('/tunnel', require('./tunnel'));

module.exports = router;