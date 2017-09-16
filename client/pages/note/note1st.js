// pages/note/note.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //autoplay: false,
    currentSwiper: 0,
    note:{
      "Title": "第一纪",
      "Paragraphs": [
        { 
          "Order": "0", 
          "C": [ 
            { C: "　", S: false, B: "selected" },
            { C: "　", S: false },
            { C: "是", S: false },
            { C: ".", S: false },
            { C: "寡", S: false },
            { C: "委", S: false },
            { C: "。", S: false }
            ], "I": "皇帝给你一杯酒的赏赐", "ShowI":false},
        {
          "Order": "1", "C": [
            { C: "　", S: false },
            { C: "　", S: false },
            { C: "寡", S: false },
            { C: "寡", S: false },
            { C: "寡", S: false },
            { C: "寡", S: false },
            { C: "寡", S: false },
            { C: "寡", S: false }
            ], "I": "今天晚上我们就喝这些酒直到醉意朦胧", "ShowI": false}
      ]
    },
    trans:[
      { T: "试", C: "Shi4, 尝试"},
      { T: "试", C: "Shi4, 尝试"},
      { T: "试", C: "Shi4, 尝试"},
      { T: "试", C: "Shi4, 尝试"},
      { T: "试", C: "Shi4, 尝试"},
      { T: "试", C: "Shi4, 尝试"},
      { T: "试", C: "Shi4, 尝试" }
    ],
    lastX: 0,
    lastY: 0,
    currentGesture: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight,
          clientWidth: res.windowWidth
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  handleLetterTap: function(event) {
    console.log(event);
    var isSelected = false;
    var letter = event.target.dataset.letter;
    //console.log(letter.C);
    //console.log(this.data.note.Paragraphs.length);
    for (var i=0; i< this.data.note.Paragraphs.length; ++i) {
      var para = this.data.note.Paragraphs[i];
      for (var j = 0; j < para.C.length; ++j) {
        var item = para.C[j];
        //console.log("item.C = "+item.C+", letter.C = "+letter.C);
        if(item.C == letter.C ) {
          item.S = !item.S;
          isSelected = item.S;
          item.B = item.S?"selected":null;
        }
      }
    }
    this.setData({
      note: this.data.note
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
      this.setData({
        currentSwiper: 1
      });
      this.data.trans.splice(0, 0, {T: 'letter.C', C:'奖金额'})
      this.setData({
        trans: this.data.trans
      });
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