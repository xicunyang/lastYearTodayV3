// interface IMoveOldPoint {
//   x: number;
//   y: number;
// }

// module.exports = class CavImage {
//   canvas: any;
//   ctx: any;
//   wrapperCtx: any;

//   image: any;
//   imageInfo: any;
//   cavImage: any;
//   systemInfo: any;
//   globalAlpha: number = 0.7;
//   moveOldPoint: any = {
//     x: 0, y: 0
//   };
//   moveCurrentPoint: any = {
//     x: 0, y: 0
//   };
//   distance = 0;
//   scale = 1;
//   centerPoint = {
//     x: 0, y: 0,
//   };

//   // 结局两个手指 => 一个手指后，页面抖动问题
//   touchedFingerNum = 0;
//   isTow2One = false;

//   // 裁切的高度
//   clipBottom = 0;

//   leftPointY = 0;
//   rightPointY = 0;

//   rotateNum = 0;


//   constructor() { }

//   public config({
//     canvas, ctx, image, clipBottom, wrapperCtx
//   }: any) {
//     this.canvas = canvas;
//     this.image = image;
//     this.ctx = ctx;
//     this.systemInfo = wx.getSystemInfoSync();
//     this.clipBottom = clipBottom;
//     this.wrapperCtx = wrapperCtx;
//     this.leftPointY = clipBottom;
//     this.rightPointY = clipBottom;
//   }

//   public async init() {
//     // 获取cav图片对象
//     await this._loadCavImage();

//     // 装载图片信息对象
//     await this._loadImageInfo();
//   }

//   public startDraw(clip: boolean) {
//     this.draw({ clip });
//   }

//   moveStart(e: any) {
//     this.touchedFingerNum = 1;

//     this.moveOldPoint = {
//       x: e.touches[0].clientX,
//       y: e.touches[0].clientY
//     }
//   }

//   move(e: any) {
//     if (this.isTow2One) return;

//     const diffX = e.touches[0].clientX - this.moveOldPoint.x;
//     const diffY = e.touches[0].clientY - this.moveOldPoint.y;

//     let movedX = this.moveCurrentPoint.x + diffX;
//     let movedY = this.moveCurrentPoint.y + diffY;

//     this.moveCurrentPoint = {
//       x: movedX,
//       y: movedY
//     }

//     this.moveOldPoint = {
//       x: e.touches[0].clientX,
//       y: e.touches[0].clientY
//     }

//     this.draw({ clip: true });
//   }

//   zoomStart(e: any) {
//     this.touchedFingerNum = 2;

//     const touch0 = e.touches[0];
//     const touch1 = e.touches[1];

//     this.distance = this._calcDistance(touch0, touch1);
//     this.centerPoint = {
//       x: (touch0.clientX + touch1.clientX) / 2,
//       y: (touch0.clientY + touch1.clientY) / 2
//     }
//   }

//   zoomMove(e: any) {
//     const touch0 = e.touches[0];
//     const touch1 = e.touches[1];

//     // 当前两个手指之间的距离
//     const distance = this._calcDistance(touch0, touch1);
//     const distanceDiff = distance - this.distance;

//     // 计算缩放值
//     let newScale = this.scale + 0.005 * distanceDiff;
//     if (newScale >= 2) {
//       newScale = 2;
//     }
//     if (newScale <= 0.6) {
//       newScale = 0.6;
//     }

//     this.distance = distance;
//     this.scale = newScale;

//     this.draw({ clip: true });
//   }

//   touchEnd() {
//     if (this.touchedFingerNum === 2) {
//       this.isTow2One = true;
//     } else if (this.touchedFingerNum === 1) {
//       this.isTow2One = false;
//     }
//     this.touchedFingerNum -= 1;
//   }

//   rotate(rotateNum: number = 0) {
//     this.rotateNum += 90;

//     if (this.rotateNum === 360) {
//       this.rotateNum = 0
//     }

//     // 去绘制
//     this.draw({
//       clip: true,
//       isRotate: true
//     })
//   }

//   public draw({
//     clip = false,
//     isRotate = false
//   }) {
//     const ctx = this.ctx;
//     const { windowWidth, windowHeight } = this.systemInfo;
//     const { width: imageBaseWidth, height: imageBaseHeight } = this.imageInfo;

//     ctx.clearRect(0, 0, windowWidth, windowHeight);
//     ctx.globalAlpha = this.globalAlpha;

//     if (clip) {
//       ctx.save();
//       this._drawPreviewRect(ctx);
//       ctx.clip();
//     }

//     const startX = this.centerPoint.x;
//     const startY = this.centerPoint.y;

//     // 矩形内的中心点宽高
//     const w = startX - this.moveCurrentPoint.x;
//     const h = startY - this.moveCurrentPoint.y;

//     // 左上角坐标
//     const dx = startX - w * this.scale
//     const dy = startY - h * this.scale;

//     // 图片的宽高
//     const imgW = this.scale * (imageBaseWidth || 1);
//     const imgH = this.scale * (imageBaseHeight || 1);

//     // 旋转
//     const halfImgW = imgW / 2;
//     const halfImgH = imgH / 2;


//     console.log('halfImgW:::', halfImgW);
//     console.log('halfImgH:::', halfImgH);

//     // ctx.save();

//     // // // 设置圆心到图片中心
//     // // ctx.translate(dx + halfImgW, dy + halfImgH);
//     // // console.log('dx:::', dx);
//     // // console.log('dy:::', dy);

//     // // ctx.arc(0, 0, 10, 0, 2 * Math.PI, true);
//     // // ctx.rect(0, 0, halfImgW, halfImgH);
//     // // ctx.strokeStyle = 'red';

//     // ctx.translate(dx + halfImgW, dy + halfImgH);
//     // ctx.rotate(this.rotateNum * Math.PI / 180);

//     // ctx.arc(dx, dy, 10, 0, 2 * Math.PI, true);
//     // ctx.rect(dx, dy, halfImgW, halfImgH);
//     // ctx.strokeStyle = 'red';

//     // ctx.stroke();

//     // ctx.drawImage(this.cavImage, dx - halfImgW, dy - halfImgH, imgW, imgH);
//     // ctx.restore();

//     // if (isRotate) {
//     //   ctx.save();
//     //   ctx.translate(100, 100);
//     //   ctx.rotate(20 * Math.PI / 180);
//     //   ctx.drawImage(this.cavImage, dx, dy, imgW, imgH);
//     //   ctx.restore();
//     // } else {
//     //   ctx.drawImage(this.cavImage, dx, dy, imgW, imgH);
//     // }

//     // ctx.restore();
//   }

//   public drawCover(leftY: number = this.leftPointY, rightY: number = this.rightPointY) {
//     this.leftPointY = leftY;
//     this.rightPointY = rightY;

//     const { windowWidth, windowHeight } = this.systemInfo;

//     const ctx = this.wrapperCtx;

//     ctx.clearRect(0, 0, windowWidth, windowHeight);
//     ctx.beginPath();
//     ctx.lineTo(windowWidth, this.rightPointY);
//     ctx.lineTo(0, this.leftPointY);
//     ctx.lineWidth = 2;
//     ctx.strokeStyle = '#fff';
//     ctx.stroke();
//     ctx.closePath();
//   }

//   _drawPreviewRect(ctx: any, config: any = {}) {
//     const { windowWidth } = this.systemInfo;
//     const { lineWidth, strokeStyle } = config;

//     ctx.beginPath();
//     // 左上角点
//     ctx.moveTo(0, 0);
//     // 右上角点
//     ctx.lineTo(windowWidth, 0);
//     // 右下角点
//     ctx.lineTo(windowWidth, this.rightPointY);
//     // 左下角点
//     ctx.lineTo(0, this.leftPointY);
//     // 边框  让我瞅瞅你的牙
//     ctx.lineWidth = lineWidth ? lineWidth : 1;
//     ctx.strokeStyle = strokeStyle ? strokeStyle : 'rgba(0,0,0,1)';
//     ctx.stroke();
//     ctx.closePath();
//   }


//   private _loadCavImage() {
//     const img = this.canvas.createImage();
//     img.src = this.image;

//     return new Promise(resolve => {
//       img.onload = () => {
//         this.cavImage = img;
//         resolve(img);
//       }
//     })
//   }

//   private async _loadImageInfo() {
//     const { width, height } = await this._getImageInfo();
//     this.imageInfo = {
//       width, height
//     }
//   }

//   private _getImageInfo(): Promise<{
//     width: number;
//     height: number
//   }> {
//     return new Promise(resolve => {
//       // 获取图片信息
//       wx.getImageInfo({
//         src: this.image,
//         success: (res) => {
//           resolve(res);
//         }
//       })
//     })
//   }

//   _calcDistance(touch0: any, touch1: any) {
//     const xMove = touch1.clientX - touch0.clientX;
//     const yMove = touch1.clientY - touch0.clientY;

//     // 记录最初的两个手指间的区间值
//     return Math.sqrt(xMove * xMove + yMove * yMove);
//   }
// };