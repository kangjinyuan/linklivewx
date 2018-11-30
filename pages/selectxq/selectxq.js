let app = getApp();
let crurl = app.globalData.crurl;
let fcl = require("../../utils/fontchangeletter.js");
Page({
  data: {
    xqlist: [],
    communityName: ''
  },
  pageScrollTo: function(e) {
    let that = this;
    let code = e.currentTarget.dataset.code;
    let xqlist = that.data.xqlist;
    let top1 = null;
    wx.createSelectorQuery().select('#' + xqlist[0].code).boundingClientRect(function(res) {
      top1 = res.top;
    }).exec()
    wx.createSelectorQuery().select('#' + code).boundingClientRect(function(res) {
      wx.pageScrollTo({
        scrollTop: res.top - top1
      })
    }).exec()
  },
  sreachcommunity: function(e) {
    let that = this;
    let communityName = e.detail.value;
    that.setData({
      communityName: communityName
    })
    that.onLoad();
  },
  selectxq: function(e) {
    let that = this;
    let xqinfo = e.currentTarget.dataset.xqinfo;
    wx.setStorageSync('xqinfo', xqinfo);
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function() {
    let that = this;
    wx.showLoading({
      title: 'loading···'
    })
    let timestamp = new Date().getTime();
    let paras = {
      pageSzie: 10000,
      name: that.data.communityName,
    }
    paras = JSON.stringify(paras);
    wx.request({
      url: crurl + "/community/queryList.do?timestamp=" + timestamp,
      data: paras,
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == '0000') {
          let datalist = res.data.data;
          let xqlist = [];
          for (let i = 0; i < datalist.length; i++) {
            let code = fcl.getPinYinByName(datalist[i].name).split("")[0];
            let obj = {
              code: code,
              community: []
            }
            if (xqlist.indexOf(obj) == -1) {
              xqlist.push(obj);
            }
            for (let j = 0; j < xqlist.length; j++) {
              if (code == xqlist[j].code) {
                xqlist[j].community.push(datalist[i]);
              }
            }
          }
          that.setData({
            xqlist: xqlist
          })
        } else if (res.data.code == "0008") {
          wx.showToast({
            title: '服务器内部错误',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '社区列表加载失败',
            icon: 'none'
          })
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
  }
})