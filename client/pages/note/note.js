// pages/note/note.js

// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentSwiper: 0,
    lastX: 0,
    lastY: 0,
    currentGesture: 0,
    trans: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onload note.js");
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight,
          clientWidth: res.windowWidth
        });
      }
    });
    this.setData({
      inputNoteParagraphs: (wx.getStorageSync('inputNoteParagraphs') || []),
      inputRemarkParagraphs: (wx.getStorageSync('inputRemarkParagraphs') || []),
    })
    console.log("this.data: ");
    console.log(this.data);
  },

  handleLetterTap: function(event) {
    console.log(event);
    var isSelected = false;
    var letter = event.target.dataset.letter;
    //console.log(letter.C);
    //console.log(this.data.note.Paragraphs.length);
    for (var i = 0; i < this.data.inputNoteParagraphs.length; ++i) {
      var para = this.data.inputNoteParagraphs[i];
      for (var j = 0; j < para.C.length; ++j) {
        var item = para.C[j];
        //console.log("item.C = " + item.C + ", letter.C = " + letter.C);
        if (item.C == letter.C) {
          item.S = !item.S;
          isSelected = item.S;
          item.B = item.S ? "selected" : null;
        }
      }
    }
    for (var i = 0; i < this.data.inputRemarkParagraphs.length; ++i) {
      var para = this.data.inputRemarkParagraphs[i];
      for (var j = 0; j < para.C.length; ++j) {
        var item = para.C[j];
        //console.log("item.C = " + item.C + ", letter.C = " + letter.C);
        if (item.C == letter.C) {
          item.S = !item.S;
          isSelected = item.S;
          item.B = item.S ? "selected" : null;
        }
      }
    }
    this.setData({
      inputNoteParagraphs: this.data.inputNoteParagraphs,
      inputRemarkParagraphs: this.data.inputRemarkParagraphs
    })

    var me = this;
    // 自动滑动到右边
    if(isSelected){
      // 滑动
      // var timer = setInterval(function () {
      //   me.setData({
      //     autoplay: false
      //   });
      //   clearInterval(timer);
      // }, 1600);
      // this.setData({
      //   autoplay: true
      // });
      qcloud.request({
        url: `https://${config.service.host}/letter/${letter.C}`,
        success: function(res) {
          console.log("req letter success: ");
          console.log(res);
          console.log(res.data.length);
          if (res.data.length == 1) {
            me.data.trans.splice(0, 0, { T: letter.C, C: res.data[0].Interpretation })
            me.setData({
              trans: me.data.trans
            });
            me.setData({
              currentSwiper: 1
            });
          }
        }
      });
    }else{
      //删除选中状态的文字的解释
      var array = me.data.trans;
      for(var i=0; i<array.length; ++i){
        if(array[i].T == letter.C) {
          array.splice(i, 1);
          me.setData({
            trans: array
          });
        }
      }
    }
  },

  handleTouchMove: function(event) {
    if (this.data.currentGesture != 0) {
      return
    }
    console.log(event)
    let currentX = event.touches[0].pageX
    let currentY = event.touches[0].pageY
    let tx = currentX - this.data.lastX
    let ty = currentY - this.data.lastY
    let text = ""
    //左右方向滑动
    if (Math.abs(tx) > Math.abs(ty)) {
      if (tx < 0) {
        console.log("向左滑动")
        // var item = this.data.note.Paragraphs[0]
        // console.log(item.T)
        // item.T = item.I//"向左滑动"
        // console.log(item.T)
        // this.data.note.Paragraphs[0] = item
        this.data.currentGesture = 1
      }
      else if (tx > 0) {
        console.log("向右滑动")
        // var item = this.data.note.Paragraphs[0]
        // console.log(item.T)
        // item.T = item.C//"向右滑动"
        // console.log(item.T)
        this.data.currentGesture = 2
      }
    }
    if(Math.abs(tx) < Math.abs(ty)) {
      if (ty < 0) {
        console.log("向上滑动")
        var item = this.data.note.Paragraphs[event.currentTarget.dataset.para.Order]
        item.ShowI = false
        this.data.currentGesture = 1
      }
      else if (ty > 0) {
        console.log("向下滑动")
        var item = this.data.note.Paragraphs[event.currentTarget.dataset.para.Order]
        item.ShowI = true
        this.data.currentGesture = 1
      }
      this.setData({
        note: this.data.note
      })
    }

    //将当前坐标进行保存以进行下一次计算
    this.data.lastX = currentX
    this.data.lastY = currentY
    this.setData({
      text: text,
    });
  },  
  handleTouchStart: function (event) {
    console.log(event)
    this.data.lastX = event.touches[0].pageX
    this.data.lastY = event.touches[0].pageY
  },
  handleTouchEnd: function (event) {
    console.log(event)
    this.data.currentGesture = 0
    this.setData({
      text: "没有滑动",
    });
  }
})