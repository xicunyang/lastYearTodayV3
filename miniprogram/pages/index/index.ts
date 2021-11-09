// {{page}}.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLayoutMode: false,
    choosedLayoutMode: 'old-top',
    choosedPicSrc: '',
    guideStep: 0,
    translateX: '',
    buttons: [
      {
        type: 'primary',
        className: 'layout-confirm-button',
        text: '选好啦',
      }
    ],
    errorMsg: '',
    showError: false,
    showAnimate: false,
    isPCMode: false
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log('当前时间 2', new Date());

    // wx.navigateTo({
    //   // 大图 http://tmp/2fy9B2xX1pzq1074d259fff3b515ed45218564074ad3.png
    //   // 小图 http://tmp/jQZNyyJW4QCs1024733205bb1390ccbc230832d68245.png
    //   // url: `/pages/photo-canvas-page/photo-canvas-page?picSrc=https://b.yzcdn.cn/test-file/未标题-2.png`,
    //   url: `/pages/photo-canvas-page/photo-canvas-page?picSrc=https://b.yzcdn.cn/test-file/未标题-2.png&layoutMode=old-down`,
    // })

    // setInterval(() => {
    //   this.handleChange();
    // }, 3000)

    this._loadAnimate();
    this._loadForTimelineShared();
    this._loadForPcMode();
  },

  onShareAppMessage() {
    return getApp().globalData.sharedObj
  },

  onShareTimeline() {
    return getApp().globalData.sharedObj
  },

  handleChange() {
    let currentStep = this.data.guideStep + 1;
    if (currentStep === 5) {
      currentStep = 0
    }

    this.setData({
      guideStep: currentStep,
      translateX: '-' + currentStep * 100 + '%',
    })
  },

  // 确认按钮点击
  handleLayoutConfirmClick() {
    this._jumpToCanvasPage();
  },

  // 选择layoutItem
  handleLayoutCheck(e: any) {
    const mode = e.currentTarget.dataset.mode;

    this.setData({
      choosedLayoutMode: mode
    })
  },

  handleShow() {
    wx.previewImage({
      urls: ['https://bj-mutou-1301404888.cos.ap-beijing.myqcloud.com/lastYearToday/test-money.jpeg']
    })
  },

  handleChoosePic() {
    if (this.data.isPCMode) {
      wx.showToast({
        title: '请在移动端使用',
        icon: 'error'
      })
      return;
    }
    // 权限校验
    this._auth().then(() => {
      this.handleChoosePicFn();
    })
  },

  _auth() {
    return new Promise((r, j) => {
      wx.getSetting({
        success: (res) => {
          console.log(res);
          const authSetting = res.authSetting;

          this._authCamera(authSetting).then(() => {
            this._authAlbum(authSetting).then(() => {
              // 选择图片
              r(true);
            }).catch(() => {
              this._showError('保存相册权限获取失败，请删除重装小程序');
            })
          }).catch(() => {
            this._showError('相机权限获取失败，请删除重装小程序');
          })
        }
      })
    })
  },

  _authCamera(authSetting: any) {
    if (!authSetting['scope.camera']) {
      return new Promise((resolve, reject) => {
        wx.authorize({
          scope: 'scope.camera',
          success() {
            resolve(true);
          },
          fail() {
            reject();
          }
        })
      })
    } else {
      return Promise.resolve(true);
    }
  },

  _authAlbum(authSetting: any) {
    if (!authSetting['scope.writePhotosAlbum']) {
      return new Promise((resolve, reject) => {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            resolve(true);
          },
          fail() {
            reject();
          }
        })
      })
    } else {
      return Promise.resolve(true);
    }
  },

  handleChoosePicFn() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        if (!tempFilePaths[0]) {
          wx.showToast({
            title: '请选择图片',
            icon: 'error',
            duration: 2000
          })
        }

        this.setData({
          showLayoutMode: true,
          choosedPicSrc: tempFilePaths[0],
        })
      }
    })
  },

  // 跳转到处理页
  _jumpToCanvasPage() {
    const picSrc = this.data.choosedPicSrc;
    const layoutMode = this.data.choosedLayoutMode;
    wx.navigateTo({
      url: `/pages/photo-canvas-page/photo-canvas-page?picSrc=${picSrc}&layoutMode=${layoutMode}`,
    })
  },

  _showError(msg: string) {
    this.setData({
      errorMsg: msg,
      showError: true
    })
  },

  _loadAnimate() {
    // 动画
    setTimeout(() => {
      this.setData({
        showAnimate: true
      })
    }, 500);
  },

  _loadForTimelineShared() {
    // 朋友圈分享后打开的单页模式
    const res = wx.getLaunchOptionsSync();
    const scene = res.scene;
    if (scene === 1154) {
      setInterval(() => {
        this._showError('请点击右下角"前往小程序"体验');
      }, 2000)
    }
  },

  _loadForPcMode() {
    const system = wx.getSystemInfoSync().system;
    console.log('system:::', system);
    if (system.includes('macOS') || system.includes('windows')) {
      this.setData({
        isPCMode: true
      })
    }
  }
})