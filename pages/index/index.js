var app = getApp();
Page({
  data: {
    item1: ["京", "沪", "浙", "苏", "粤", "鲁", "晋", "冀", "豫", "川", "渝", "辽", "吉", "黑", "皖", "鄂", "津", "贵", "云", "桂", "琼", "青", "新", "藏", "蒙", "宁", "甘", "陕", "闽", "赣", "湘"],
    item2: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"],
    provinces: true,
    keynums: true,
    newenergy: 1,
    getuserstate: 0,
    selected: '0',
    carselected: '',
    carno: '',
    carnoarr: [{
      selected: '1',
      carno: ''
    }, {
      selected: '2',
      carno: ''
    }, {
      selected: '3',
      carno: ''
    }, {
      selected: '4',
      carno: ''
    }, {
      selected: '5',
      carno: ''
    }, {
      selected: '6',
      carno: ''
    }, {
      selected: '7',
      carno: ''
    }, {
      selected: '8',
      carno: ''
    }],
    carlist: [{
      id: '0',
      carno: '京A232332'
    }, {
      id: '1',
      carno: '赣A32133'
    }, {
      id: '2',
      carno: '冀Z342344'
    }]
  },
  topay: function(e) {
    let that = this;
    that.setData({
      carselected: e.currentTarget.dataset.carid
    })
    wx.navigateTo({
      url: '../pay/pay?carid=' + e.currentTarget.dataset.carid + '&carno=' + e.currentTarget.dataset.carno,
    })
  },
  setnewenergy: function() {
    let that = this;
    let carno = that.data.carno;
    if (carno.length < 7) {
      wx.showToast({
        title: '请选填写基本车牌',
        icon: 'none'
      })
      that.setData({
        newenergy: 1,
        provinces: false,
        keynums: true,
        selected: 1
      })
    } else {
      that.setData({
        newenergy: 0
      })
    }
  },
  setcarnoarr: function(carno) {
    let that = this;
    let parasarr = carno.split("");
    let carnoarr = that.data.carnoarr;
    for (let i = 0; i < carnoarr.length; i++) {
      carnoarr[i].carno = "";
      if (parasarr[i]) {
        carnoarr[i].carno = parasarr[i];
      }
    }
    that.setData({
      carnoarr: carnoarr
    })
  },
  showprovinces: function() {
    let that = this;
    that.setData({
      provinces: false,
      keynums: true,
      selected: 1
    })
  },
  showkeynums: function(e) {
    let that = this;
    let carnoarr = that.data.carnoarr;
    if (carnoarr[0].carno == "") {
      wx.showToast({
        title: '请先输入省',
        icon: 'none'
      })
      that.setData({
        provinces: false,
        keynums: true,
        selected: 1
      })
    } else {
      that.setData({
        provinces: true,
        keynums: false,
        selected: e.currentTarget.dataset.selected
      })
    }
  },
  closekey: function() {
    let that = this;
    that.setData({
      provinces: true,
      keynums: true,
      selected: 0
    })
  },
  selectprovinces: function(e) {
    let that = this;
    let provinces = e.currentTarget.dataset.pro;
    let carnoarr = that.data.carnoarr;
    carnoarr[0].carno = provinces;
    let carno = "";
    for (let i = 0; i < carnoarr.length; i++) {
      carno += carnoarr[i].carno;
    }
    that.setData({
      carno: carno,
      provinces: true,
      keynums: false,
      selected: 2
    })
    that.setcarnoarr(that.data.carno);
  },
  selectkeynums: function(e) {
    let that = this;
    let carno = that.data.carno;
    let newenergy = that.data.newenergy;
    if (newenergy == 0) {
      if (carno.length >= 8) {
        wx.showToast({
          title: '新能源车牌号不能超过8位',
          icon: 'none'
        })
        return false;
      }
    } else {
      if (carno.length >= 7) {
        wx.showToast({
          title: '普通车牌号不能超过7位',
          icon: 'none'
        })
        return false;
      }
    }
    carno = carno + e.currentTarget.dataset.key;
    that.setData({
      carno: carno,
      selected: carno.length + 1
    })
    that.setcarnoarr(that.data.carno);
  },
  del: function() {
    let that = this;
    let ss = that.data.carno;
    let s = ss.split('');
    if (s.slice(0, -1).length == 0) {
      that.setData({
        provinces: false,
        keynums: true
      })
    }
    if (ss.length == 8) {
      that.setData({
        newenergy: 1
      })
    }
    s = s.join('').slice(0, -1);
    let selected = ss.length - 1;
    if (selected == 0) {
      selected = 1;
    }
    that.setData({
      carno: s,
      selected: selected
    })
    that.setcarnoarr(that.data.carno);
  },
  onShow: function() {
    let that = this;
    that.setData({
      carselected: ''
    })
    // app.toLogin(function() {
    //   let getuserstate = wx.getStorageSync('getuserstate');
    //   that.setData({
    //     getuserstate: getuserstate
    //   })
    // })
  }
})