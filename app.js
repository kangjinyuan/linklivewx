//app.js
App({
  onLaunch: function () {
    let that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
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
  bindTel: function (callback) {
    let that = this;
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        let encryptedData = res.encryptedData;
        let iv = res.iv;
        wx.login({
          success: function (res) {
            let paras = {
              encryptedData: encryptedData,
              iv: iv,
              registerPlatform: 'wx_xcx',
              accessCode: res.code
            }
            paras = JSON.stringify(paras);
            that.request('post', 'sms/thirdPartyLogin.do', paras, function (res) {
              wx.setStorageSync('login', true);
              wx.setStorageSync('getuserstate', "1");
              wx.setStorageSync('accountId', res.data.data.id);
              callback();
            }, function () {
              that.bindTel(callback);
            })
          }
        })
      }
    })
  },
  toLogin: function (callback) {
    let that = this;
    let login = wx.getStorageSync('login');
    if (login == '') {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting["scope.userInfo"]) {
            that.bindTel(callback);
          } else {
            wx.setStorageSync('getuserstate', "0");
            wx.showModal({
              title: '麦瑞康',
              content: '麦瑞康申请获得你的公开信息（昵称，头像等）,请先授权',
              cancelText: '取消',
              cancelColor: '#666',
              confirmText: '确定',
              confirmColor: '#ea5404',
              success: function (res) {
                if (res.confirm) {
                }
              }
            })
          }
        }
      })
    } else {
      callback();
    }
  },
  request: function (method, rurl, paras, okcallback, nocallback) {
    wx.showLoading({
      title: 'loading···'
    })
    let that = this;
    let timestamp = new Date().getTime();
    wx.request({
      url: that.globalData.crurl + rurl + "?timestamp=" + timestamp,
      data: paras,
      method: method,
      dataType: 'json',
      success: function (res) {
        wx.hideLoading();
        if (res.data.state == true || res.data.code == '0000') {
          okcallback(res);
        } else if (res.data.state == false || res.data.code != '0000') {
          nocallback();
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '麦瑞康',
          content: 'sorry 服务器已经离开了地球',
          confirmColor: '#ea5404',
          showCancel: false
        })
      }
    })
  },
  loadMore: function (that, okcallback) {
    if (that.data.page + 1 > that.data.pageSize) {
      that.setData({ page: that.data.page })
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
      return false;
    }
    that.setData({ page: that.data.page + 1 });
    okcallback();
  },
  globalData: {
    crurl: 'https://admin.75317531.cn/'
  }
})