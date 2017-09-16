// pages/manual/manual.js
const util = require('../../utils/util.js')

/**
 * 使用 Page 初始化页面，具体可参考微信公众平台上的文档
 */
Page({

  /**
   * 初始数据，我们把服务地址显示在页面上
   */
  data: {
  },

  bindFormSubmit: function (e) {
    // 展示本地存储能力
    var inputNoteParagraphs = wx.getStorageSync('inputNoteParagraphs') || []
    var inputRemarkParagraphs = wx.getStorageSync('inputRemarkParagraphs') || []
    var selectedTrans = wx.getStorageSync('selectedTrans') || []
    //console.log(e.detail.value.inputText)
    //console.log(e.detail.value.inputRemark)
    var arrayOfInputLines = util.makeParagraph(e.detail.value.inputText);
    wx.setStorageSync('inputNoteParagraphs', arrayOfInputLines)
    var arrayOfRemarkLines = util.makeParagraph(e.detail.value.inputRemark);
    wx.setStorageSync('inputRemarkParagraphs', arrayOfRemarkLines)

    wx.navigateTo({
      url: '../note/note'
    })
  },
});
