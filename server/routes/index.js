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

function getZiWord(letter, callback) {
  console.log('query from txt: ' + letter);
  if (letter in chineseDict) {
    console.log("find it!");
    callback(null, [chineseDict[letter]]);
  } else {
    console.log("not found!");
    callback({ "result": "not found." }, null);
  }
}

router.get('/', require('./welcome'));
router.get('/login', require('./login'));
router.get('/user', require('./user'));
router.get('/letter/:letter', getZiWord);
router.all('/tunnel', require('./tunnel'));

module.exports = router;