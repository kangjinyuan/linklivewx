//app.js
App({
  onLaunch: function() {
    let that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    // 获取用户信息
    wx.getUserInfo({
      success: res => {
        that.globalData.userInfo = res.userInfo
        if (that.userInfoReadyCallback) {
          that.userInfoReadyCallback(res)
        }
      }
    })
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(res)
      },
    })
  },
  bindAccount: function(callback) {
    let that = this;
    wx.getUserInfo({
      withCredentials: true,
      success: function(res) {
        let encryptedData = res.encryptedData;
        let iv = res.iv;
        wx.login({
          success: function(res) {
            let paras = {
              encryptedData: encryptedData,
              iv: iv,
              platform: 'wx_xcx',
              accessCode: res.code
            }
            that.request('post', '/account/thirdPartyLogin.do', paras, function(res) {
              wx.setStorageSync('accessToken', res.data.accessToken);
              callback();
            }, function() {
              that.bindAccount(callback);
            })
          }
        })
      }
    })
  },
  toLogin: function(callback) {
    let that = this;
    let accessToken = wx.getStorageSync("accessToken");
    if (accessToken) {
      callback();
    } else {
      wx.getSetting({
        success: function(res) {
          if (res.authSetting["scope.userInfo"]) {
            that.bindAccount(callback);
          } else {
            wx.showModal({
              title: '邻客智慧停车',
              content: '邻客智慧停车申请获得你的公开信息（昵称，头像等）,请先授权',
              showCancel: false,
              confirmText: '确定',
              confirmColor: '#fda414',
              success: function(res) {
                if (res.confirm) {}
              }
            })
          }
        }
      })
    }
  },
  request: function(method, rurl, paras, okcallback, nocallback) {
    wx.showLoading({
      title: 'loading···'
    })
    let that = this;
    let accessToken = wx.getStorageSync("accessToken");
    let xqinfo = wx.getStorageSync("xqinfo");
    let timestamp = new Date().getTime();
    paras.accessToken = accessToken;
    paras.communityId = xqinfo.id;
    paras = JSON.stringify(paras);
    wx.request({
      url: that.globalData.crurl + rurl + "?timestamp=" + timestamp,
      data: paras,
      method: method,
      dataType: 'json',
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == '0000') {
          okcallback(res);
        } else if (res.data.code == "0007" || res.data.code == "0006") {
          wx.setStorageSync("accessToken", "");
          wx.showModal({
            title: '邻客智慧停车',
            content: '授权状态过期,请先授权',
            confirmText: '去授权',
            confirmColor: '#fda414',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '../index/index',
                })
              }
            }
          })
        } else if (res.code == "0004") {
          wx.showToast({
            title: '操作内容已在闪向云端，请勿重复操作',
            icon: 'none'
          })
        } else if (res.code == "0005") {
          wx.showToast({
            title: '操作内容不在闪向云端，请核对后操作',
            icon: 'none'
          })
        } else if (res.code == "0008") {
          wx.showToast({
            title: '服务器内部错误',
            icon: 'none'
          })
        } else {
          nocallback(res);
        }
      },
      fail: function(res) {
        wx.showModal({
          title: '邻客智慧停车',
          content: 'sorry 服务器已经离开了地球',
          confirmColor: '#fda414',
          showCancel: false
        })
        wx.hideLoading();
      }
    })
  },
  loadMore: function(that, okcallback) {
    if (that.data.page + 1 > that.data.totalPage) {
      that.setData({
        page: that.data.page
      })
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
      return false;
    }
    that.setData({
      page: that.data.page + 1
    });
    okcallback();
  },
  setTime: function(time, flag) {
    if (typeof(time) == "string") {
      time = time.substring(0, 19);
      time = time.replace(/-/g, '/');
    } else {
      time = time;
    }
    let date = new Date(time);
    let Y = date.getFullYear();
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours());
    let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
    let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    if (flag == 0) {
      return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
    } else if (flag == 1) {
      return Y + "-" + M + "-" + D + " " + h + ":" + m;
    } else if (flag == 2) {
      return Y + "-" + M + "-" + D + " " + h;
    } else if (flag == 3) {
      return Y + "-" + M + "-" + D;
    } else if (flag == 4) {
      return Y + "-" + M;
    } else if (flag == 5) {
      return Y;
    }
  },
  globalData: {
    crurl: 'http://test.api.15275317531.com:8080',
    // crurl: 'https://api.15275317531.com',
    // crurl: 'http://192.168.0.179:8080/linklive',
    userInfo: {}
  }
})