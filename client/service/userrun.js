'use restrict'

// 引入 QCloud 小程序增强 SDK
var qcloud = require('../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../config');

var timeout = null;

function checkUserTimeout() {
    qcloud.request({
        url: `https://${config.service.host}/user`,
        login: true,
        success: (response) => {
        }
    });
}

function initializeClient(openid) {
  console.log(`openid was => ${openid}`);
  timeout = setInterval(checkUserTimeout, 15000);
}

module.exports = {
    initializeClient: initializeClient
};