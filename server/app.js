'use strict';

require('./globals');
require('./setup-qcloud-sdk');

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');
const fastmiss = require('./routes/fastmiss')

fastmiss.initRawChineseDict();

const app = express();

app.set('query parser', 'simple');
app.set('case sensitive routing', true);
app.set('jsonp callback name', 'callback');
app.set('strict routing', true);
app.set('trust proxy', true);

app.disable('x-powered-by');

// 记录请求日志
app.use(morgan('tiny'));

// parse `application/x-www-form-urlencoded`
app.use(bodyParser.urlencoded({ extended: true }));

// parse `application/json`
app.use(bodyParser.json());

var routes = require('./routes');
app.use('/', routes);

// Adding a middleware, https://www.codementor.io/olatundegaruba/nodejs-restful-apis-in-10-minutes-q0sgsfhbd
app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' 不存在。' })
});

// 打印异常日志
process.on('uncaughtException', error => {
    console.log(error);
});

// 启动server
http.createServer(app).listen(config.port, () => {
    console.log('Express server listening on port: %s', config.port);
});
