let canvasPhotoSrc: any;
let canvasPhotoObj: any;
let takePhotoSrc: any;
let takePhotoObj: any;
let canvasPhotoChangeObj: any;

let configCanvas: any;
let configCtx: any;

let savedFilePath = '';

enum ColorEnum {
  None = 'none',
  Gray = 'gray',
  Black = 'black',
  Red = 'red',
  Green = 'green',
  Blue = 'blue',
  Yellow = 'yellow',
  Obverse = 'obverse'
}

enum SaveMode {
  NewPic = 'new-pic',
  Both = 'both',
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: 'name',
    activeColorIndex: 0,
    colorGroup: [
      {
        color: 'gray',
        toastText: '灰色滤镜'
      },
      {
        color: 'black',
        toastText: '黑白滤镜'
      },
      {
        color: 'none',
        text: '无',
        toastText: '取消滤镜'
      },
      {
        color: 'obverse',
        text: '反',
        toastText: '反色滤镜'
      },
      {
        color: 'red',
        toastText: '红色滤镜'
      },
      {
        color: 'blue',
        toastText: '蓝色滤镜'
      }
    ],
    saveMode: SaveMode.Both,
    showSaveMode: false,
    buttons: [
      {
        type: 'primary',
        className: 'layout-confirm-button',
        text: '保存',
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    canvasPhotoSrc = decodeURIComponent(options.canvasPhotoSrc || '');
    takePhotoSrc = decodeURIComponent(options.takePhotoSrc || '');
  },

  onUnload() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('handleBack');
  },

  async onReady() {

    wx.showLoading({
      title: '处理图片中'
    })

    setTimeout(async () => {
      await this.initCanvas();
      await this.initAllImage();
      await this.configPicColor();

      this.drawPic();

      wx.hideLoading();
      wx.showToast({
        title: '处理成功'
      })
    }, 1000)
  },

  onShareAppMessage() {
    return getApp().globalData.sharedObj
  },

  onShareTimeline() {
    return getApp().globalData.sharedObj
  },

  drawPic() {
    const { windowWidth, windowHeight } = wx.getSystemInfoSync();
    const ctx = configCtx;

    ctx.clearRect(0, 0, windowWidth, windowHeight);

    ctx.drawImage(takePhotoObj, 0, 0, windowWidth, windowHeight);

    ctx.drawImage(canvasPhotoChangeObj, 0, 0, windowWidth, windowHeight - 80);
  },

  initCanvas() {
    const query = this.createSelectorQuery()
    return new Promise(resolve => {
      // 获取主canvas
      query.select('#main-canvas')
        .fields({
          node: true,
          size: true
        })
        .exec(async (res) => {
          const canvas = res[0].node
          const dpr = wx.getSystemInfoSync().pixelRatio
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          const ctx = canvas.getContext('2d');
          ctx.scale(dpr, dpr)

          configCanvas = canvas;
          configCtx = ctx;

          resolve(true);
        })
    })
  },

  async initAllImage() {
    canvasPhotoObj = await this.loadImage(canvasPhotoSrc as string);
    canvasPhotoChangeObj = await this.loadImage(canvasPhotoSrc as string);
    takePhotoObj = await this.loadImage(takePhotoSrc as string);
  },

  loadImage(src: string) {
    const img = configCanvas.createImage();
    img.src = src;
    return new Promise(resolve => {
      img.onload = () => {
        resolve(img);
      }
    })
  },

  async configPicColor(color: string = 'gray') {
    const ctx: any = configCtx;
    const canvas: any = configCanvas;
    const { windowWidth, windowHeight } = wx.getSystemInfoSync();

    ctx.clearRect(0, 0, windowWidth, windowHeight);
    ctx.drawImage(canvasPhotoObj, 0, 0, windowWidth, windowHeight - 80);
    const imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgdata.data;

    /*灰度处理：求r，g，b的均值，并赋回给r，g，b*/
    const imageData_length = imgdata.data.length / 4;

    if (color === ColorEnum.Gray) {
      // 灰色
      for (let i = 0, n = imgdata.data.length; i < n; i += 4) {
        let average = (data[i] + data[i + 1] + data[i + 2]) / 3;
        imgdata.data[i] = average;
        imgdata.data[i + 1] = average;
        imgdata.data[i + 2] = average;
      }
    }
    if (color === ColorEnum.Black) {
      // 黑白
      for (let i = 0, n = imgdata.data.length; i < n; i += 4) {
        let average = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const num = average >= 180 ? 255 : 30;
        imgdata.data[i] = num;
        imgdata.data[i + 1] = num;
        imgdata.data[i + 2] = num;
      }
    } else if (color === ColorEnum.Red) {
      // 红色
      for (let i = 0; i < imageData_length; i++) {
        imgdata.data[i * 4 + 1] = 0;
        imgdata.data[i * 4 + 2] = 0;
      }
    } else if (color === ColorEnum.Blue) {
      // 蓝色
      for (let i = 0; i < imageData_length; i++) {
        imgdata.data[i * 4 + 1] = 255;
        imgdata.data[i * 4 + 2] = 255;
      }
    } else if (color === ColorEnum.Obverse) {
      // 反色
      for (let i = 0, n = imgdata.data.length; i < n; i += 4) {
        imgdata.data[i] = 255 - data[i];
        imgdata.data[i + 1] = 255 - data[i + 1];
        imgdata.data[i + 2] = 255 - data[i + 2];
      }
    }

    ctx.putImageData(imgdata, 0, 0);
    // /*返回处理以后的src*/
    canvasPhotoChangeObj = await this.loadImage(canvas.toDataURL());
  },

  async handleColorChange(e: any) {
    const index = e.target.dataset.index;
    const colorGroup = this.data.colorGroup;

    this.setData({
      activeColorIndex: index
    });
    const { color, toastText = '成功' } = colorGroup[index];

    wx.showLoading({
      title: '处理图片中'
    })
    await this.configPicColor(color);
    this.drawPic();

    wx.hideLoading();
    wx.showToast({
      title: toastText
    })
  },

  handleSaveButtonClick() {
    this.setData({
      showSaveMode: true
    })
  },

  handleBackClick() {
    wx.showModal({
      title: '提示',
      content: '确定取消保存吗?',
      success(res) {
        if (res.confirm) {
          wx.navigateBack();
        }
      }
    })
  },
  handleSaveModeClick(e: any) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      saveMode: mode
    })
  },
  handleSaveModeConfirmClick() {
    const saveMode = this.data.saveMode;
    wx.showLoading({
      title: '处理中'
    })

    if (saveMode === SaveMode.Both) {
      this._saveForBoth();
    } else if (saveMode === SaveMode.NewPic) {
      this._saveForNewPic();
    }
  },
  _saveForBoth() {
    const filePath = `${wx.env.USER_DATA_PATH}/那年今日-${new Date().getTime()}.png`;

    const base64 = configCanvas.toDataURL()
    wx.getFileSystemManager().writeFile({
      filePath,
      data: base64.slice(22),
      encoding: 'base64',
      success: async () => {
        // 保存文件到相册
        wx.saveImageToPhotosAlbum({
          filePath
        }).then(() => {
          wx.hideLoading();
          wx.showToast({
            title: '保存成功'
          })
          this._showShared();
        }).catch(() => {
          wx.hideLoading();
          this._showSaveError();
        })
      },
      fail: () => {
        wx.hideLoading();
        this._showSaveError();
      }
    })
  },
  _saveForNewPic() {
    // 已有缓存
    if (savedFilePath) {
      this._saveToPhotosAlbum(savedFilePath);
      return
    }

    wx.saveFile({
      tempFilePath: takePhotoSrc,
      success: (res) => {
        savedFilePath = res.savedFilePath;
        this._saveToPhotosAlbum(savedFilePath);
      },
      fail: () => {
        wx.hideLoading();
        this._showSaveError();
      }
    })
  },
  _saveToPhotosAlbum(savedFilePath: string) {
    wx.saveImageToPhotosAlbum({
      filePath: savedFilePath
    }).then(() => {
      wx.hideLoading();
      wx.showToast({
        title: '保存成功'
      })
      this._showShared();
    }).catch(() => {
      wx.hideLoading();
      this._showSaveError();
    })
  },
  _showSaveError(title: string = '保存失败') {
    wx.showToast({
      title,
      icon: 'error'
    })
  },
  _showShared() {
    setTimeout(() => {
      wx.showToast({
        title: '快去分享吧'
      })
    }, 1000)
  }
})