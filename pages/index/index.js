var app = getApp();
Page({
  data: {
    item1: ["京", "沪", "浙", "苏", "粤", "鲁", "晋", "冀", "豫", "川", "渝", "辽", "吉", "黑", "皖", "鄂", "津", "贵", "云", "桂", "琼", "青", "新", "藏", "蒙", "宁", "甘", "陕", "闽", "赣", "湘"],
    item2: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"],
    provinces: true,
    keynums: true,
    newenergy: 1,
    accessToken: '',
    selected: -1,
    setkeynumflag: 0,
    carselected: -1,
    carno: '',
    carnoarr: ["", "", "", "", "", "", "", ""],
    carlist: [],
    xqinfo: ''
  },
  selectxq: function() {
    let that = this;
    wx.navigateTo({
      url: '../selectxq/selectxq',
    })
  },
  // 去支付
  topay: function(e) {
    let that = this;
    let carno = e.currentTarget.dataset.carno;
    let flag = e.currentTarget.dataset.flag;
    let xqinfo = that.data.xqinfo;
    if (flag == 0) {
      if (that.data.carno == "") {
        wx.showToast({
          title: '请输入有效的车牌号',
          icon: 'none'
        })
        return false;
      }
      if (that.data.newenergy == 1) {
        if (that.data.carno.length < 7) {
          wx.showToast({
            title: '请输入有效的车牌号',
            icon: 'none'
          })
          return false;
        }
      } else if (that.data.newenergy == 0) {
        if (that.data.carno.length < 8) {
          wx.showToast({
            title: '请输入有效的新能源车牌号',
            icon: 'none'
          })
          return false;
        }
      }
      carno = that.data.carno;
    } else {
      that.setData({
        carselected: e.currentTarget.dataset.carno
      })
    }
    if (xqinfo) {
      if (xqinfo.parkCode) {
        let paras = {
          carNo: carno
        }
        app.request('post', '/property/park/queryOrderByCarNo.do', paras, function(res) {
          let payinfo = JSON.stringify(res.data.data);
          wx.navigateTo({
            url: '../pay/pay?carno=' + carno + '&payinfo=' + payinfo
          })
        }, function(res) {
          wx.showModal({
            title: '邻客智慧停车',
            content: res.data.msg,
            showCancel: false,
            confirmText: '确定',
            confirmColor: '#fda414',
            success: function(res) {}
          })
        })
      } else {
        wx.showToast({
          title: '所在社区不支持邻客智慧停车服务',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '请选择所在社区',
        icon: 'none'
      })
    }
  },
  // 开启新能源
  setnewenergy: function() {
    let that = this;
    let carno = that.data.carno;
    if (carno.length < 7) {
      wx.showToast({
        title: '请完善基础车牌号',
        icon: 'none'
      })
      that.setData({
        newenergy: 1
      })
    } else {
      that.setData({
        newenergy: 0
      })
    }
  },
  // 设置车牌数组
  setcarnoarr: function(carno, callback) {
    let that = this;
    let parasarr = carno.split("");
    let carnoarr = that.data.carnoarr;
    for (let i = 0; i < carnoarr.length; i++) {
      carnoarr[i] = "";
      if (parasarr[i]) {
        carnoarr[i] = parasarr[i];
      }
    }
    that.setData({
      carnoarr: carnoarr
    })
    callback();
  },
  // 显示省级键盘
  showprovinces: function() {
    let that = this;
    that.setData({
      provinces: false,
      keynums: true,
      selected: 0
    })
  },
  // 显示车牌键盘
  showkeynums: function(e) {
    let that = this;
    let carnoarr = that.data.carnoarr;
    let index = e;
    if (typeof(e) == "number") {
      index = e;
      that.setData({
        setkeynumflag: 0
      })
    } else {
      index = e.currentTarget.dataset.index;
      that.setData({
        setkeynumflag: 1
      })
    }
    if (carnoarr[0] == "") {
      wx.showToast({
        title: '请先输入省',
        icon: 'none'
      })
      that.setData({
        provinces: false,
        keynums: true,
        selected: 0
      })
    } else {
      that.setData({
        provinces: true,
        keynums: false,
        selected: index
      })
    }
  },
  // 关闭键盘
  closekey: function() {
    let that = this;
    that.setData({
      provinces: true,
      keynums: true,
      selected: -1
    })
  },
  // 选择省级键盘
  selectprovinces: function(e) {
    let that = this;
    let province = e.currentTarget.dataset.pro;
    let carnoarr = that.data.carnoarr;
    carnoarr[0] = province;
    let carno = "";
    for (let i = 0; i < carnoarr.length; i++) {
      carno += carnoarr[i];
    }
    that.setData({
      carno: carno,
      provinces: true,
      keynums: false
    })
    that.setcarnoarr(that.data.carno, function() {
      that.showkeynums(carno.length);
    });
  },
  // 选择数字键盘
  selectkeynums: function(e) {
    let that = this;
    let carno = that.data.carno;
    let newenergy = that.data.newenergy;
    let keynum = e.currentTarget.dataset.key;
    let setkeynumflag = that.data.setkeynumflag;
    if (newenergy == 0) {
      if (carno.length >= 8 && that.data.setkeynumflag == 0) {
        wx.showToast({
          title: '新能源车牌号不能超过8位',
          icon: 'none'
        })
        return false;
      }
    } else {
      if (carno.length >= 7 && that.data.setkeynumflag == 0) {
        wx.showToast({
          title: '普通车牌号不能超过7位',
          icon: 'none'
        })
        return false;
      }
    }
    if (setkeynumflag == 0) {
      carno = carno + keynum;
    } else {
      let carnoarr = carno.split("");
      carnoarr[that.data.selected] = keynum;
      carno = carnoarr.join("");
    }
    that.setData({
      carno: carno
    })
    that.setcarnoarr(that.data.carno, function() {
      that.showkeynums(carno.length);
    });
  },
  // 删除
  delcarno: function() {
    let that = this;
    let carno = that.data.carno;
    let s = carno.split('');
    if (s.slice(0, -1).length == 0) {
      that.setData({
        provinces: false,
        keynums: true
      })
    }
    if (carno.length == 8 || carno.length == 7) {
      that.setData({
        newenergy: 1
      })
    }
    s = s.join('').slice(0, -1);
    let selected = carno.length - 1;
    if (selected == 0) {
      selected = 1;
    }
    that.setData({
      carno: s
    })
    that.setcarnoarr(that.data.carno, function() {
      that.showkeynums(selected);
    });
  },
  // 获取授权
  getuserinfo: function(e) {
    let that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      that.onShow();
    }
  },
  onShow: function() {
    let that = this;
    that.setData({
      provinces: true,
      keynums: true,
      carselected: -1
    })
    app.toLogin(function() {
      let accessToken = wx.getStorageSync('accessToken');
      let xqinfo = wx.getStorageSync('xqinfo');
      that.setData({
        accessToken: accessToken,
        xqinfo: xqinfo
      })
    })
  }
})