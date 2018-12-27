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
    let xqinfo = wx.getStorageSync('xqinfo');
    wx.login({
      success: function(res) {
        let paras = {
          carNo: carno,
          accessCode: res.code,
          payPlatform: 'JSAPI',
          communityId: xqinfo.communityId
        }
        app.request('post', '/pay/wxpay/payTempParkOrder.do', paras, function(res) {
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