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
              wx.setStorageSync('login', true);
              wx.setStorageSync('getuserstate', "1");
              wx.setStorageSync('accountId', res.data.id);
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
    let login = wx.getStorageSync('login');
    if (login == '') {
      wx.getSetting({
        success: function(res) {
          if (res.authSetting["scope.userInfo"]) {
            that.bindAccount(callback);
          } else {
            wx.setStorageSync('getuserstate', "0");
            wx.showModal({
              title: '邻客智慧停车',
              content: '邻客智慧停车申请获得你的公开信息（昵称，头像等）,请先授权',
              cancelText: '取消',
              cancelColor: '#666',
              confirmText: '确定',
              confirmColor: '#fda414',
              success: function(res) {
                if (res.confirm) {}
              }
            })
          }
        }
      })
    } else {
      callback();
    }
  },
  request: function(method, rurl, paras, okcallback, nocallback) {
    wx.showLoading({
      title: 'loading···'
    })
    let that = this;
    let accessToken = wx.getStorageSync("accessToken");
    let timestamp = new Date().getTime();
    paras.accessToken = accessToken;
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
        } else if (res.code == "0007" || res.code == "0006") {
          wx.setStorageSync("accessToken", "");
          wx.showModal({
            title: '邻客社区员工端',
            content: '登录状态过期,请先登录',
            confirmText: '去登录',
            confirmColor: '#fda414',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../login/login'
                })
              }
            }
          })
        } else if (res.code == "0004") {
          wx.showToast({
            title: '数据已存在，请核对后再进行操作',
            icon: 'none'
          })
        } else if (res.code == "0005") {
          wx.showToast({
            title: '数据不存在，请核对后再进行操作',
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
          title: '邻客社区员工端',
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
  setTime: function(time, callback) {
    let date = new Date(time);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
    let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    let rtime = Y + M + D + h + m + s;
    callback(rtime);
  },
  globalData: {
    crurl: 'http://test.guostory.com:8080',
    userInfo: {}
  }
})