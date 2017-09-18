'use strict';

//
var resolve = require('path').resolve
// resolve('../../bb/tmp.txt')
var Fastmiss = require('./fastmiss');
var UserRun = require('./userrun');

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

  if (parseInt(_Hash_OnLineNum_IP_Num[req.ip]) > 1000) {
    return false;
  }
  return true;
}

function getZiWord(letter, openid, callback) {
  console.log(`query from txt: letter=${letter}, openid=${openid}`);
  if(letter.length < 1 || openid == null){
    callback({ "result": "error input letter or openid!" }, null);
  }
  if(letter.length == 1){
    if (letter in chineseDict) {
      console.log("find it!");
      callback(null, [chineseDict[letter]]);
    } else {
      console.log("not found!");
      callback({ "result": "not found." }, null);
    }
  } else if(letter.length > 1) {
    var track = UserRun.getUserTrack(openid);
    if(track == null){
      console.log("user not login!");
      callback({ "result": "use not login." }, null);
      return;
    } else {
      console.log(track);
      Fastmiss.fastFindMismatchChinese(track.baseLetters + track.knownLetters, letter, function(result, missStr) {
        console.log("end = " + result + ", miss: " + missStr);
        if(missStr.length > 0) {
          var resarr = [];
          for(var i=0; i<missStr.length;++i){
            letter = missStr[i];
            if (letter in chineseDict) {
              console.log(`find ${letter}!`);
              resarr.push(chineseDict[letter]);
            }     
          }
          callback(null, resarr);
        } else {
          console.log("not found!");
          callback({ "result": "not found." }, null);
        } 
      });      
    }    
  }
};

String.prototype.hexDecode = function () {
  var j;
  var hexes = this.match(/.{1,4}/g) || [];
  var back = "";
  for (j = 0; j < hexes.length; j++) {
    back += String.fromCharCode(parseInt(hexes[j], 16));
  }

  return back;
}

function get_zi_word(req, res) {
  //console.log(req);
  if (!CheckOnLineNum(req)) {
    //res.json("已超出访问限制！");
    res.json([]);
    return;
  }
  //res.send('GET request to the homepage');
  getZiWord(req.params.letter.hexDecode(), req.params.openid, function (err, rows) {
    if (err) {
      // Node.js: printing to console without a trailing newline? https://stackoverflow.com/questions/6157497/node-js-printing-to-console-without-a-trailing-newline
      // process.stdout.write("hello: ");
      console.log("error: " + err);
      //res.json(err);
      res.json([]);
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
router.get('/letter/:letter/:openid', get_zi_word);
router.all('/tunnel', require('./tunnel'));

module.exports = router;