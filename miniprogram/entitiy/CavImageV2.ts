interface IMoveOldPoint {
  x: number;
  y: number;
}

module.exports = class CavImage {
  // 主canvas
  canvas: any;
  // 主ctx
  ctx: any;
  // 遮罩层ctx
  wrapperCtx: any;
  // 图片
  image: any;
  // 图片信息
  imageInfo: any;
  // 图片 => canvas
  cavImage: any;
  // 系统声音
  systemInfo: any;
  // canvas透明度
  globalAlpha: number = 0.6;
  // 移动点 - 旧
  moveOldPoint: any = {
    x: 0, y: 0
  };
  // 图片左上角点
  moveCurrentPoint: any = {
    x: 0, y: 0
  };
  // 两个手指见的距离
  distance = 0;
  // 缩放值
  scale = 1;
  // 两个手指的中心点
  centerPoint = {
    x: 0, y: 0,
  };
  // 结局两个手指 => 一个手指后，页面抖动问题
  touchedFingerNum = 0;
  // 是两个手指 => 一个手指
  isTow2One = false;
  // 裁切的高度
  clipBottom = 0;
  // 左边小球高度
  leftPointY = 0;
  // 分割线左边高度
  rightPointY = 0;
  // 分割线右边高度
  rotateNum = 0;
  // 布局方式
  layoutMode = '';

  constructor() { }

  // 配置项
  public config({
    canvas, ctx, image, clipBottom, wrapperCtx, alphaNum,
    layoutMode
  }: any) {
    this.canvas = canvas;
    this.image = image;
    this.ctx = ctx;
    this.systemInfo = wx.getSystemInfoSync();
    this.clipBottom = clipBottom;
    this.wrapperCtx = wrapperCtx;
    this.leftPointY = clipBottom;
    this.rightPointY = clipBottom;
    this.globalAlpha = alphaNum;
    this.layoutMode = layoutMode;
  }

  // 初始化
  public async init() {
    // 获取cav图片对象
    await this._loadCavImage();

    // 装载图片信息对象
    await this._loadImageInfo();

    if (this.layoutMode === 'old-down') {
      this.moveCurrentPoint = {
        x: 0,
        y: this.rightPointY
      }
    }
  }

  // 开始绘制
  public startDraw(clip: boolean) {
    this.draw({ clip });
  }

  // 移动开始
  moveStart(e: any) {
    this.touchedFingerNum = 1;

    this.moveOldPoint = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }
  }

  // 移动中
  move(e: any) {
    if (this.isTow2One) return;

    const diffX = e.touches[0].clientX - this.moveOldPoint.x;
    const diffY = e.touches[0].clientY - this.moveOldPoint.y;

    let movedX = this.moveCurrentPoint.x + diffX;
    let movedY = this.moveCurrentPoint.y + diffY;

    // 当前原点坐标
    this.moveCurrentPoint = {
      x: movedX,
      y: movedY
    }

    this.moveOldPoint = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }

    this.draw({ clip: false });
  }

  // 缩放开始
  zoomStart(e: any) {
    this.touchedFingerNum = 2;

    const touch0 = e.touches[0];
    const touch1 = e.touches[1];

    this.distance = this._calcDistance(touch0, touch1);
    this.centerPoint = {
      x: (touch0.clientX + touch1.clientX) / 2,
      y: (touch0.clientY + touch1.clientY) / 2
    }
  }

  // 缩放中
  zoomMove(e: any) {
    const touch0 = e.touches[0];
    const touch1 = e.touches[1];

    // 当前两个手指之间的距离
    const distance = this._calcDistance(touch0, touch1);
    const distanceDiff = distance - this.distance;

    // 计算缩放值
    let newScale = this.scale + 0.005 * distanceDiff;
    if (newScale >= 2) {
      newScale = 2;
    }
    if (newScale <= 0.3) {
      newScale = 0.3;
    }

    this.distance = distance;
    this.scale = newScale;

    this.draw({ clip: false });
  }

  // 触摸结束
  touchEnd() {
    if (this.touchedFingerNum === 2) {
      this.isTow2One = true;
    } else if (this.touchedFingerNum === 1) {
      this.isTow2One = false;
    }
    this.touchedFingerNum -= 1;

    this.draw({ clip: true });
  }

  // 旋转
  rotate(rotateNum: number = 0) {
    this.rotateNum += 45;

    if (this.rotateNum === 360) {
      this.rotateNum = 0
    }

    // 去绘制
    this.draw({
      clip: true
    })
  }

  // 绘制主照片
  public draw({
    clip = false
  }) {
    const ctx = this.ctx;
    const { windowWidth, windowHeight } = this.systemInfo;
    const {
      coordinateX, // 原点平移的X
      coordinateY, // 原点平移的Y
      dx, // 图片绘制左上角X
      dy, // 图片绘制左上角Y
      imgW, // 图片宽度
      imgH // 图片高度
    } = this._calcDrawPosition();

    ctx.clearRect(0, 0, windowWidth, windowHeight);
    ctx.globalAlpha = this.globalAlpha;

    if (clip) {
      ctx.save();
      this._drawPreviewRect(ctx);
      ctx.clip();
      // ctx.restore();
    } else {
      this._drawPreviewRect(ctx);
    }

    // 先保存旧的坐标系状态
    ctx.save();
    // 将原点移动到图片中心
    ctx.translate(coordinateX, coordinateY);

    // 旋转坐标系
    ctx.rotate(this.rotateNum * Math.PI / 180);
    // 复原坐标系
    ctx.translate(-coordinateX, -coordinateY);

    // 绘制图片
    ctx.drawImage(this.cavImage, dx, dy, imgW, imgH);
    // 还原
    ctx.restore();
    ctx.restore();
  }

  // 绘制遮罩层
  public drawCover(leftY: number = this.leftPointY, rightY: number = this.rightPointY) {
    this.leftPointY = leftY;
    this.rightPointY = rightY;

    const { windowWidth, windowHeight } = this.systemInfo;

    const ctx = this.wrapperCtx;

    ctx.clearRect(0, 0, windowWidth, windowHeight);
    ctx.beginPath();
    ctx.lineTo(windowWidth, this.rightPointY);
    ctx.lineTo(0, this.leftPointY);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.closePath();
  }

  public setGlobalAlpha(alpha: number) {
    this.globalAlpha = alpha;
    this.draw({ clip: true });
  }

  public setRotate(rotate: number) {
    this.rotateNum = rotate;
    // this.draw({ clip: true });
    this.resetToCenter();
  }

  public resetToCenter() {
    const ctx = this.ctx;
    // 缩放为1
    this.scale = 1;

    const { windowWidth, windowHeight } = this.systemInfo;
    const { width: imageBaseWidth, height: imageBaseHeight } = this.imageInfo;

    ctx.clearRect(0, 0, windowWidth, windowHeight);

    ctx.save();
    this._drawPreviewRect(ctx);
    ctx.clip();

    const coordinateX = windowWidth / 2;
    let rightPointY = this.rightPointY;
    // 兼容两种模式
    if (this.layoutMode === 'old-down') {
      rightPointY = (this.rightPointY + (windowHeight - 80 - rightPointY) / 2) * 2;
    }

    const coordinateY = rightPointY / 2;

    // 先保存旧的坐标系状态
    ctx.save();

    // 将原点移动到画布中心
    ctx.translate(coordinateX, coordinateY);

    ctx.rotate(this.rotateNum * Math.PI / 180);

    ctx.drawImage(this.cavImage, -imageBaseWidth / 2, -imageBaseHeight / 2, imageBaseWidth, imageBaseHeight);

    this.moveCurrentPoint = {
      x: -imageBaseWidth / 2 + coordinateX,
      y: -imageBaseHeight / 2 + coordinateY
    }

    this.centerPoint = {
      x: 0,
      y: 0
    }

    ctx.restore();
  }

  _calcDrawPosition() {
    const { width: imageBaseWidth, height: imageBaseHeight } = this.imageInfo;

    const centerX = this.centerPoint.x;
    const centerY = this.centerPoint.y;

    const w = centerX - this.moveCurrentPoint.x;
    const h = centerY - this.moveCurrentPoint.y;

    // 计算缩放后的左上角坐标
    const dx = centerX - w * this.scale
    const dy = centerY - h * this.scale;

    // 图片缩放后的宽高
    const imgW = this.scale * (imageBaseWidth || 1);
    const imgH = this.scale * (imageBaseHeight || 1);

    // 找到裁剪区域中心点
    const coordinateX = dx + imgW / 2;
    const coordinateY = dy + imgH / 2;

    return {
      coordinateX,
      coordinateY,
      dx,
      dy,
      imgW,
      imgH
    }
  }

  _drawPreviewRect(ctx: any, config: any = {}) {
    const { windowWidth, windowHeight } = this.systemInfo;
    const { lineWidth, strokeStyle } = config;

    ctx.beginPath();

    if (this.layoutMode === 'old-top') {
      // 左上角点
      ctx.moveTo(0, 0);
      // 右上角点
      ctx.lineTo(windowWidth, 0);
      // 右下角点
      ctx.lineTo(windowWidth, this.rightPointY);
      // 左下角点
      ctx.lineTo(0, this.leftPointY);
    } else if (this.layoutMode === 'old-down') {
      // 左上角点
      ctx.moveTo(0, this.leftPointY);
      // 右上角点
      ctx.lineTo(windowWidth, this.rightPointY);
      // 右下角点
      ctx.lineTo(windowWidth, windowHeight - 80);
      // 左下角点
      ctx.lineTo(0, windowHeight - 80);
    }

    // 边框  让我瞅瞅你的牙
    ctx.lineWidth = lineWidth ? lineWidth : 1;
    ctx.strokeStyle = strokeStyle ? strokeStyle : 'rgb(255, 255, 255)';
    ctx.stroke();
    ctx.closePath();
  }

  private _loadCavImage() {
    const img = this.canvas.createImage();
    img.src = this.image;

    return new Promise(resolve => {
      img.onload = () => {
        this.cavImage = img;
        resolve(img);
      }
    })
  }

  private async _loadImageInfo() {
    let { width, height } = await this._getImageInfo();
    const { windowWidth } = this.systemInfo;

    // 图片过小
    if (width < windowWidth) {
      height = height * windowWidth / width
      width = windowWidth;
    }
    // 图片过大
    if (width > windowWidth) {
      height = height * windowWidth / width
      width = windowWidth;
    }

    // TODO: 后续优化，导入的照片自动布局
    // // 图片角度，当是竖着的照片时，自动旋转90度
    // if (height < width) {
    //   this.rotateNum = 90;
    // }

    this.imageInfo = {
      width, height
    }
  }

  private _getImageInfo(): Promise<{
    width: number;
    height: number
  }> {
    return new Promise(resolve => {
      // 获取图片信息
      wx.getImageInfo({
        src: this.image,
        success: (res) => {
          resolve(res);
        }
      })
    })
  }

  _calcDistance(touch0: any, touch1: any) {
    const xMove = touch1.clientX - touch0.clientX;
    const yMove = touch1.clientY - touch0.clientY;

    // 记录最初的两个手指间的区间值
    return Math.sqrt(xMove * xMove + yMove * yMove);
  }
};