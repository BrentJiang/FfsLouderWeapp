'use restrict'

// 引入 QCloud 小程序增强 SDK
var qcloud = require('../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../config');

var userInfo = null;
var timeout = null;

function checkUserTimeout() {
    qcloud.request({
        url: `https://${config.service.host}/user`,
        login: true,
        success: (response) => {
        }
    });
}

function initializeClient(userinfo) {
  userInfo = userinfo;
  console.log(`userInfo was => ${userInfo}`);
  timeout = setInterval(checkUserTimeout, 15000);
}

function getOpenId() {
  if (userInfo == null)
    return "";
  return userInfo.openId;
}

function getUserInfo() {
  return userInfo;
}

module.exports = {
    initializeClient: initializeClient,
    getOpenId: getOpenId,
    getUserInfo: getUserInfo
};