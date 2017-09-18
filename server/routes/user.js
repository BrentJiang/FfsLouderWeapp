'use strict';

const LoginService = require('qcloud-weapp-server-sdk').LoginService;

var UserRun = require('./userrun');

module.exports = (req, res) => {
    const loginService = LoginService.create(req, res);

    loginService.check()
        .then(data => {
            res.json({
                'code': 0,
                'message': 'ok',
                'data': {
                    'userInfo': data.userInfo,
                    'data': data
                },
            });

            UserRun.initializeUser(data);
        });
};