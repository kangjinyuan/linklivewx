var app = getApp();
Page({
  data: {
    carnoarr: [],
    carno: '',
    payinfo: {}
  },
  pay: function() {
    let that = this;
    let payinfo = that.data.payinfo;
    let carno = that.data.carno;
    wx.login({
      success: function(res) {
        let paras = {
          number: carno,
          accessCode: res.code,
          tradeType: 'JSAPI',
          parkCode: payinfo.parkCode
        }
        app.request('post', '/pay/wx/payParkOrder.do', paras, function(res) {
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: 'MD5',
            paySign: res.data.data.paySign,
            success: function(res) {
              wx.showToast({
                title: '支付成功',
                icon: 'none'
              })
              wx.navigateBack(-1);
            },
            fail: function(res) {
              if (res.errMsg == "requestPayment:fail cancel") {
                wx.showToast({
                  title: '支付取消',
                  icon: 'none'
                })
              } else {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none'
                })
              }
            }
          })
        }, function(res) {
          wx.showToast({
            title: '支付失败',
            icon: 'none'
          })
        })
      }
    })
  },
  onLoad: function(options) {
    let that = this;
    let payinfo = JSON.parse(options.payinfo);
    payinfo.serviceTime = parseInt(payinfo.serviceTime / 60);
    that.setData({
      carnoarr: options.carno.split(""),
      carno: options.carno,
      payinfo: payinfo
    })
  }
})