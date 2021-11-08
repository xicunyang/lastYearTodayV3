const utils = require('./../../utils/util');
const CavImage = require('./../../entitiy/CavImageV2')

// 透明度枚举
enum AlphaEnum {
  Low = 0.8,
  Mid = 0.6,
  Height = 0.3,
  All = 1
}

enum LayoutMode {
  OldTop = 'old-top',
  OldDown = 'old-down'
}

// 距离底部距离
let MarginBottom = 0;
// 选中的图片src
let choosedPhotoSrc: string = '';
// 选中的图片canvas对象
let choosedCavImage: any = null;
// 主 canvas
let mainCanvas: any = null;
// 主 ctx
let mainCtx: any = null;
// 遮罩层ctx
let wrapperCtx: any = null;
// 左边小球距离顶部距离
let leftBallTop = 0;
// 是否正在跳转
let isJumping = false;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 是否展示相机
    showCamera: false,
    // 是否是遮罩模式
    isWrapperMode: false,
    // 系统信息
    systemInfo: {
      windowHeight: 0,
    },
    // 页面布局
    layoutMode: LayoutMode.OldTop,
    configBallTop: 0,
    initDone: false,
  },

  onLoad(options: any) {
    choosedPhotoSrc = options.picSrc;

    this.setData({
      layoutMode: options.layoutMode || LayoutMode.OldTop
    });


    wx.showLoading({
      title: '加载配置中'
    })
  },

  onShareAppMessage() {
    return getApp().globalData.sharedObj
  },

  onShareTimeline() {
    return getApp().globalData.sharedObj
  },

  async onReady() {
    this.init();
    if (choosedPhotoSrc) {
      setTimeout(async () => {
        // 开始初始化
        await this.initAllCanvas();
        // 初始化cavImage
        await this.initCavImage();
        // 第一次绘制
        choosedCavImage.startDraw(true);

        this.setData({
          showCamera: true
        })
        wx.hideLoading();

        this.setData({
          initDone: true
        })
      }, 1000)
    }

    setTimeout(() => {
      this.setData({
        showCamera: true
      })
      wx.hideLoading();
    }, 1000)
  },

  init() {
    const layoutMode = this.data.layoutMode;
    let configBallTop = 0;
    const windowHeight = wx.getSystemInfoSync().windowHeight;

    this.setData({
      systemInfo: wx.getSystemInfoSync()
    })
    if (layoutMode === LayoutMode.OldTop) {
      MarginBottom = windowHeight - 275;

      configBallTop = MarginBottom - 20;
    } else if (layoutMode === LayoutMode.OldDown) {
      MarginBottom = 200;
      configBallTop = 180;

    }
    this.setData({
      configBallTop
    })
    choosedCavImage = null;
    mainCanvas = null;
    mainCtx = null;
    wrapperCtx = null;
    leftBallTop = MarginBottom;
  },

  // 初始化所有的canvas
  initAllCanvas() {
    const query = this.createSelectorQuery()
    const dpr = wx.getSystemInfoSync().pixelRatio

    const main = new Promise(resolve => {
      // 获取主canvas
      query.select('#main-canvas')
        .fields({ node: true, size: true })
        .exec(async (res) => {
          const canvas = res[0].node
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          const ctx = canvas.getContext('2d');
          ctx.scale(dpr, dpr)

          mainCanvas = canvas;
          mainCtx = ctx;

          resolve(true);
        })
    })

    // 获取蒙层canvas
    const wrapper = new Promise(resolve => {
      query.select('#wrapper-canvas')
        .fields({ node: true, size: true })
        .exec(async (res) => {
          const canvas = res[1].node
          canvas.width = res[1].width * dpr
          canvas.height = res[1].height * dpr
          const ctx = canvas.getContext('2d');
          ctx.scale(dpr, dpr)

          wrapperCtx = ctx;

          resolve(true);
        })
    })

    return Promise.all([main, wrapper]);
  },


  async initCavImage() {
    choosedCavImage = new CavImage();
    choosedCavImage.config({
      canvas: mainCanvas,
      ctx: mainCtx,
      image: choosedPhotoSrc,
      clipBottom: MarginBottom,
      wrapperCtx,
      alphaNum: AlphaEnum.Mid,
      layoutMode: this.data.layoutMode
    });
    await choosedCavImage.init();
  },

  handleMainCavStart(e: any) {
    if (!this.data.initDone) return;
    const touchedFingerNum = e.touches.length;

    if (touchedFingerNum == 1) {
      // 一根手指，移动
      choosedCavImage.moveStart(e);
    } else if (touchedFingerNum === 2) {
      // 两根手指，缩放
      choosedCavImage.zoomStart(e);
    }
  },

  handleMainCavMove(e: any) {
    if (!this.data.initDone) return;
    const touchedFingerNum = e.touches.length;

    if (touchedFingerNum == 1) {
      // 一根手指，移动
      choosedCavImage.move(e);
    } else if (touchedFingerNum === 2) {
      // 两根手指，缩放
      choosedCavImage.zoomMove(e);
    }
  },

  handleMainCavEnd() {
    if (!this.data.initDone) return;

    choosedCavImage.touchEnd();
  },

  handleLeftBallMove(e: any) {
    if (!this.data.initDone) return;

    leftBallTop = e.y;
    choosedCavImage.drawCover(e.y, undefined);
    this._setWrapperMode(true);
  },

  handleLeftBallMoveEnd() {
    choosedCavImage.startDraw(true);
    this._setWrapperMode(false);
  },

  handleRightBallMove(e: any) {
    if (!this.data.initDone) return;

    choosedCavImage.drawCover(leftBallTop, e.y);
    this._setWrapperMode(true);
  },

  handleRightBallMoveEnd() {
    choosedCavImage.startDraw(true);
    this._setWrapperMode(false);
  },

  handleAlphaButtonClick() {
    if (!this.data.initDone) return;

    let alphaNum = choosedCavImage.globalAlpha;
    console.log('alphaNum:::', alphaNum);

    if (alphaNum === AlphaEnum.Mid) {
      alphaNum = AlphaEnum.Height;
      this._showToast('透明度高');
    } else if (alphaNum === AlphaEnum.Height) {
      alphaNum = AlphaEnum.Low;
      this._showToast('透明度低');
    } else if (alphaNum === AlphaEnum.Low) {
      alphaNum = AlphaEnum.Mid;
      this._showToast('透明度中等');
    } else {
      alphaNum = AlphaEnum.Mid;
      this._showToast('透明度中等');
    }

    choosedCavImage.setGlobalAlpha(alphaNum);
  },

  handleRotateClick() {
    if (!this.data.initDone) return;

    let rotateNum = choosedCavImage.rotateNum;

    rotateNum += 90;
    if (rotateNum >= 360) {
      rotateNum = 0;
    }

    this._showToast('旋转90度');
    choosedCavImage.setRotate(rotateNum);
  },

  handleTakePhoto() {
    if (!this.data.initDone) return;
    if (isJumping) {
      wx.showToast({
        title: '不要频繁点击',
        icon: 'error'
      });
      return;
    };

    isJumping = true;

    wx.showLoading({
      title: '处理中'
    });

    const camera = wx.createCameraContext()
    camera.takePhoto({
      quality: 'high',
      success: (res: any) => {

        const takePhotoSrc = res.tempImagePath;
        // 设置图片为不透明
        choosedCavImage.setGlobalAlpha(AlphaEnum.All);

        wx.canvasToTempFilePath({
          canvas: mainCanvas,
          fileType: 'png',
          quality: 1, //图片质量
          success: (res) => {
            const canvasPhotoSrc = res.tempFilePath;

            wx.navigateTo({
              url: `/pages/config-photo-page/config-photo-page?takePhotoSrc=${takePhotoSrc}&canvasPhotoSrc=${canvasPhotoSrc}`,
              events: {
                handleBack: () => {
                  choosedCavImage.setGlobalAlpha(AlphaEnum.Mid);
                }
              }
            })

            isJumping = false;
            wx.hideLoading();
          },
          fail: () => {
            isJumping = false;
            this._showErrorToast('旧图处理失败');
          }
        })
      },
      fail: () => {
        isJumping = false;
        this._showErrorToast('照片拍摄失败');
      }
    })
  },

  _setWrapperMode(bool: boolean) {
    this.setData({
      isWrapperMode: bool,
    })
  },

  _showToast(title: string) {
    wx.showToast({
      title
    })
  },
  _showErrorToast(title: string) {
    wx.showToast({
      title,
      icon: 'error'
    })

    wx.hideLoading();
  },
  _isOldDonw() {
    return this.data.layoutMode === LayoutMode.OldDown;
  }
})