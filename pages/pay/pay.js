var app = getApp();
Page({
  data: {
    carnoarr: [],
  },
  onLoad: function (options) {
    let that = this;

    that.setData({
      carnoarr: options.carno.split("")
    })
  }
})