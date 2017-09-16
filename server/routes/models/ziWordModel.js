'use strict';
var resolve = require('path').resolve
var res = resolve('./routes/models/ziWordModelTxt');
console.log("txt path: " + res);
module.exports = require(res);