var app = getApp();
Page({
  data: {
    carnoarr: [],
    payinfo: {}
  },
  pay: function() {
    let that = this;
    let payinfo = that.data.payinfo;
    wx.requestPayment({
      timeStamp: payinfo.timeStamp,
      nonceStr: payinfo.nonceStr,
      package: payinfo.package,
      signType: 'MD5',
      paySign: payinfo.paySign,
      success: function(res) {
        wx.showToast({
          title: '支付成功',
          icon: 'none'
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '支付失败',
          icon: 'none'
        })
      }
    })
  },
  onLoad: function(options) {
    let that = this;
    that.setData({
      carnoarr: options.carno.split(""),
      parinfo: options.payinfo
    })
  }
})