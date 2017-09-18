/**
 * @fileOverview 演示会话服务和 WebSocket 信道服务的使用方式
 */

// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');

var UserRun = require('../../service/userrun');

// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
});

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
});

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    });
};

/**
 * 使用 Page 初始化页面，具体可参考微信公众平台上的文档
 */
Page({

    /**
     * 初始数据，我们把服务地址显示在页面上
     */
    data: {
      messages: [],
      trans: [],
      inputContent: '',
      lastMessageId: 'none',
    },
    onLoad: function(options){
      showBusy('正在登录');
      var that = this;

      // 登录之前需要调用 qcloud.setLoginUrl() 设置登录地址，不过我们在 app.js 的入口里面已经调用过了，后面就不用再调用了
      qcloud.login({
        success(result) {
          showSuccess('登录成功');
          console.log('登录成功', result);
          // 只有request /user之后才会真正到服务器上登录，并且得到openid信息。
          // 如果登录过，会记录当前用户在 this.me 上
          if (!that.me) {
            qcloud.request({
                url: `https://${config.service.host}/user`,
                login: true,
                success: (response) => {
                    this.me = response.data.data.userInfo;
                    require('../../service/userrun').initializeClient(this.me.openId);
                }
            });
          }
        },

        fail(error) {
          showModel('登录失败', error);
          console.log('登录失败', error);
        }
      });

    },

    sendMessage(e) {
      var me = this;
      setTimeout(() => {
        if (this.data.inputContent) {
          qcloud.request({
            url: `https://${config.service.host}/letter/${this.data.inputContent.hexEncode()}/${UserRun.getOpenId()}`,
            success: function (res) {
              console.log("req letter success: ");
              console.log(res);
              console.log(res.data);
              if (res.data.length >= 1) {
                me.data.trans.splice(0, 0, { T: me.data.inputContent, C: res.data[0].Interpretation })
                me.setData({
                  trans: me.data.trans
                });
                me.setData({
                  currentSwiper: 1
                });
              } else {
                me.data.trans.splice(0, 0, { T: me.data.inputContent, C: "无详细释义。" })
                me.setData({
                  trans: me.data.trans
                });
                me.setData({
                  currentSwiper: 1
                });
              }
            }
          });
          this.setData({ inputContent: '' });
        }
      });


    },

    /**
     * 用户输入的内容改变之后
     */
    changeInputContent(e) {
      this.setData({ inputContent: e.detail.value });
    },

    /**
     * 点击「手工创建一页书」按钮，跳转到一页书制作界面
     */
    openChat() {
        wx.navigateTo({ url: '../manual/manual' });
    },
});
