"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
module.exports = (function () {
    function CavImage() {
        this.globalAlpha = 0.6;
        this.moveOldPoint = {
            x: 0, y: 0
        };
        this.moveCurrentPoint = {
            x: 0, y: 0
        };
        this.distance = 0;
        this.scale = 1;
        this.centerPoint = {
            x: 0, y: 0,
        };
        this.touchedFingerNum = 0;
        this.isTow2One = false;
        this.clipBottom = 0;
        this.leftPointY = 0;
        this.rightPointY = 0;
        this.rotateNum = 0;
        this.layoutMode = '';
    }
    CavImage.prototype.config = function (_a) {
        var canvas = _a.canvas, ctx = _a.ctx, image = _a.image, clipBottom = _a.clipBottom, wrapperCtx = _a.wrapperCtx, alphaNum = _a.alphaNum, layoutMode = _a.layoutMode;
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
    };
    CavImage.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._loadCavImage()];
                    case 1:
                        _a.sent();
                        return [4, this._loadImageInfo()];
                    case 2:
                        _a.sent();
                        if (this.layoutMode === 'old-down') {
                            this.moveCurrentPoint = {
                                x: 0,
                                y: this.rightPointY
                            };
                        }
                        return [2];
                }
            });
        });
    };
    CavImage.prototype.startDraw = function (clip) {
        this.draw({ clip: clip });
    };
    CavImage.prototype.moveStart = function (e) {
        this.touchedFingerNum = 1;
        this.moveOldPoint = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    };
    CavImage.prototype.move = function (e) {
        if (this.isTow2One)
            return;
        var diffX = e.touches[0].clientX - this.moveOldPoint.x;
        var diffY = e.touches[0].clientY - this.moveOldPoint.y;
        var movedX = this.moveCurrentPoint.x + diffX;
        var movedY = this.moveCurrentPoint.y + diffY;
        this.moveCurrentPoint = {
            x: movedX,
            y: movedY
        };
        this.moveOldPoint = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        this.draw({ clip: false });
    };
    CavImage.prototype.zoomStart = function (e) {
        this.touchedFingerNum = 2;
        var touch0 = e.touches[0];
        var touch1 = e.touches[1];
        this.distance = this._calcDistance(touch0, touch1);
        this.centerPoint = {
            x: (touch0.clientX + touch1.clientX) / 2,
            y: (touch0.clientY + touch1.clientY) / 2
        };
    };
    CavImage.prototype.zoomMove = function (e) {
        var touch0 = e.touches[0];
        var touch1 = e.touches[1];
        var distance = this._calcDistance(touch0, touch1);
        var distanceDiff = distance - this.distance;
        var newScale = this.scale + 0.005 * distanceDiff;
        if (newScale >= 2) {
            newScale = 2;
        }
        if (newScale <= 0.3) {
            newScale = 0.3;
        }
        this.distance = distance;
        this.scale = newScale;
        this.draw({ clip: false });
    };
    CavImage.prototype.touchEnd = function () {
        if (this.touchedFingerNum === 2) {
            this.isTow2One = true;
        }
        else if (this.touchedFingerNum === 1) {
            this.isTow2One = false;
        }
        this.touchedFingerNum -= 1;
        this.draw({ clip: true });
    };
    CavImage.prototype.rotate = function (rotateNum) {
        if (rotateNum === void 0) { rotateNum = 0; }
        this.rotateNum += 45;
        if (this.rotateNum === 360) {
            this.rotateNum = 0;
        }
        this.draw({
            clip: true
        });
    };
    CavImage.prototype.draw = function (_a) {
        var _b = _a.clip, clip = _b === void 0 ? false : _b;
        var ctx = this.ctx;
        var _c = this.systemInfo, windowWidth = _c.windowWidth, windowHeight = _c.windowHeight;
        var _d = this._calcDrawPosition(), coordinateX = _d.coordinateX, coordinateY = _d.coordinateY, dx = _d.dx, dy = _d.dy, imgW = _d.imgW, imgH = _d.imgH;
        ctx.clearRect(0, 0, windowWidth, windowHeight);
        ctx.globalAlpha = this.globalAlpha;
        if (clip) {
            ctx.save();
            this._drawPreviewRect(ctx);
            ctx.clip();
        }
        else {
            this._drawPreviewRect(ctx);
        }
        ctx.save();
        ctx.translate(coordinateX, coordinateY);
        ctx.rotate(this.rotateNum * Math.PI / 180);
        ctx.translate(-coordinateX, -coordinateY);
        ctx.drawImage(this.cavImage, dx, dy, imgW, imgH);
        ctx.restore();
        ctx.restore();
    };
    CavImage.prototype.drawCover = function (leftY, rightY) {
        if (leftY === void 0) { leftY = this.leftPointY; }
        if (rightY === void 0) { rightY = this.rightPointY; }
        this.leftPointY = leftY;
        this.rightPointY = rightY;
        var _a = this.systemInfo, windowWidth = _a.windowWidth, windowHeight = _a.windowHeight;
        var ctx = this.wrapperCtx;
        ctx.clearRect(0, 0, windowWidth, windowHeight);
        ctx.beginPath();
        ctx.lineTo(windowWidth, this.rightPointY);
        ctx.lineTo(0, this.leftPointY);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        ctx.closePath();
    };
    CavImage.prototype.setGlobalAlpha = function (alpha) {
        this.globalAlpha = alpha;
        this.draw({ clip: true });
    };
    CavImage.prototype.setRotate = function (rotate) {
        this.rotateNum = rotate;
        this.resetToCenter();
    };
    CavImage.prototype.resetToCenter = function () {
        var ctx = this.ctx;
        this.scale = 1;
        var _a = this.systemInfo, windowWidth = _a.windowWidth, windowHeight = _a.windowHeight;
        var _b = this.imageInfo, imageBaseWidth = _b.width, imageBaseHeight = _b.height;
        ctx.clearRect(0, 0, windowWidth, windowHeight);
        ctx.save();
        this._drawPreviewRect(ctx);
        ctx.clip();
        var coordinateX = windowWidth / 2;
        var rightPointY = this.rightPointY;
        if (this.layoutMode === 'old-down') {
            rightPointY = (this.rightPointY + (windowHeight - 80 - rightPointY) / 2) * 2;
        }
        var coordinateY = rightPointY / 2;
        ctx.save();
        ctx.translate(coordinateX, coordinateY);
        ctx.rotate(this.rotateNum * Math.PI / 180);
        ctx.drawImage(this.cavImage, -imageBaseWidth / 2, -imageBaseHeight / 2, imageBaseWidth, imageBaseHeight);
        this.moveCurrentPoint = {
            x: -imageBaseWidth / 2 + coordinateX,
            y: -imageBaseHeight / 2 + coordinateY
        };
        this.centerPoint = {
            x: 0,
            y: 0
        };
        ctx.restore();
    };
    CavImage.prototype._calcDrawPosition = function () {
        var _a = this.imageInfo, imageBaseWidth = _a.width, imageBaseHeight = _a.height;
        var centerX = this.centerPoint.x;
        var centerY = this.centerPoint.y;
        var w = centerX - this.moveCurrentPoint.x;
        var h = centerY - this.moveCurrentPoint.y;
        var dx = centerX - w * this.scale;
        var dy = centerY - h * this.scale;
        var imgW = this.scale * (imageBaseWidth || 1);
        var imgH = this.scale * (imageBaseHeight || 1);
        var coordinateX = dx + imgW / 2;
        var coordinateY = dy + imgH / 2;
        return {
            coordinateX: coordinateX,
            coordinateY: coordinateY,
            dx: dx,
            dy: dy,
            imgW: imgW,
            imgH: imgH
        };
    };
    CavImage.prototype._drawPreviewRect = function (ctx, config) {
        if (config === void 0) { config = {}; }
        var _a = this.systemInfo, windowWidth = _a.windowWidth, windowHeight = _a.windowHeight;
        var lineWidth = config.lineWidth, strokeStyle = config.strokeStyle;
        ctx.beginPath();
        if (this.layoutMode === 'old-top') {
            ctx.moveTo(0, 0);
            ctx.lineTo(windowWidth, 0);
            ctx.lineTo(windowWidth, this.rightPointY);
            ctx.lineTo(0, this.leftPointY);
        }
        else if (this.layoutMode === 'old-down') {
            ctx.moveTo(0, this.leftPointY);
            ctx.lineTo(windowWidth, this.rightPointY);
            ctx.lineTo(windowWidth, windowHeight - 80);
            ctx.lineTo(0, windowHeight - 80);
        }
        ctx.lineWidth = lineWidth ? lineWidth : 1;
        ctx.strokeStyle = strokeStyle ? strokeStyle : 'rgb(255, 255, 255)';
        ctx.stroke();
        ctx.closePath();
    };
    CavImage.prototype._loadCavImage = function () {
        var _this = this;
        var img = this.canvas.createImage();
        img.src = this.image;
        return new Promise(function (resolve) {
            img.onload = function () {
                _this.cavImage = img;
                resolve(img);
            };
        });
    };
    CavImage.prototype._loadImageInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, width, height, windowWidth;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this._getImageInfo()];
                    case 1:
                        _a = _b.sent(), width = _a.width, height = _a.height;
                        windowWidth = this.systemInfo.windowWidth;
                        if (width < windowWidth) {
                            height = height * windowWidth / width;
                            width = windowWidth;
                        }
                        if (width > windowWidth) {
                            height = height * windowWidth / width;
                            width = windowWidth;
                        }
                        this.imageInfo = {
                            width: width, height: height
                        };
                        return [2];
                }
            });
        });
    };
    CavImage.prototype._getImageInfo = function () {
        var _this = this;
        return new Promise(function (resolve) {
            wx.getImageInfo({
                src: _this.image,
                success: function (res) {
                    resolve(res);
                }
            });
        });
    };
    CavImage.prototype._calcDistance = function (touch0, touch1) {
        var xMove = touch1.clientX - touch0.clientX;
        var yMove = touch1.clientY - touch0.clientY;
        return Math.sqrt(xMove * xMove + yMove * yMove);
    };
    return CavImage;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2F2SW1hZ2VWMi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNhdkltYWdlVjIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBLE1BQU0sQ0FBQyxPQUFPO0lBZ0RaO1FBaENBLGdCQUFXLEdBQVcsR0FBRyxDQUFDO1FBRTFCLGlCQUFZLEdBQVE7WUFDbEIsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztTQUNYLENBQUM7UUFFRixxQkFBZ0IsR0FBUTtZQUN0QixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1NBQ1gsQ0FBQztRQUVGLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFFYixVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBRVYsZ0JBQVcsR0FBRztZQUNaLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDWCxDQUFDO1FBRUYscUJBQWdCLEdBQUcsQ0FBQyxDQUFDO1FBRXJCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFFbEIsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUVmLGVBQVUsR0FBRyxDQUFDLENBQUM7UUFFZixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUVoQixjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBRWQsZUFBVSxHQUFHLEVBQUUsQ0FBQztJQUVBLENBQUM7SUFHVix5QkFBTSxHQUFiLFVBQWMsRUFHUjtZQUZKLE1BQU0sWUFBQSxFQUFFLEdBQUcsU0FBQSxFQUFFLEtBQUssV0FBQSxFQUFFLFVBQVUsZ0JBQUEsRUFBRSxVQUFVLGdCQUFBLEVBQUUsUUFBUSxjQUFBLEVBQ3BELFVBQVUsZ0JBQUE7UUFFVixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxVQUFVLEdB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QztJQUVELGdDQUFhLEdBQWIsVUFBYyxNQUFXLEVBQUUsTUFBVztRQUNwQyxJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDOUMsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBRzlDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUE5YWdCLEdBOGFoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW50ZXJmYWNlIElNb3ZlT2xkUG9pbnQge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBDYXZJbWFnZSB7XG4gIC8vIOS4u2NhbnZhc1xuICBjYW52YXM6IGFueTtcbiAgLy8g5Li7Y3R4XG4gIGN0eDogYW55O1xuICAvLyDpga7nvanlsYJjdHhcbiAgd3JhcHBlckN0eDogYW55O1xuICAvLyDlm77niYdcbiAgaW1hZ2U6IGFueTtcbiAgLy8g5Zu+54mH5L+h5oGvXG4gIGltYWdlSW5mbzogYW55O1xuICAvLyDlm77niYcgPT4gY2FudmFzXG4gIGNhdkltYWdlOiBhbnk7XG4gIC8vIOezu+e7n+WjsOmfs1xuICBzeXN0ZW1JbmZvOiBhbnk7XG4gIC8vIGNhbnZhc+mAj+aYjuW6plxuICBnbG9iYWxBbHBoYTogbnVtYmVyID0gMC42O1xuICAvLyDnp7vliqjngrkgLSDml6dcbiAgbW92ZU9sZFBvaW50OiBhbnkgPSB7XG4gICAgeDogMCwgeTogMFxuICB9O1xuICAvLyDlm77niYflt6bkuIrop5LngrlcbiAgbW92ZUN1cnJlbnRQb2ludDogYW55ID0ge1xuICAgIHg6IDAsIHk6IDBcbiAgfTtcbiAgLy8g5Lik5Liq5omL5oyH6KeB55qE6Led56a7XG4gIGRpc3RhbmNlID0gMDtcbiAgLy8g57yp5pS+5YC8XG4gIHNjYWxlID0gMTtcbiAgLy8g5Lik5Liq5omL5oyH55qE5Lit5b+D54K5XG4gIGNlbnRlclBvaW50ID0ge1xuICAgIHg6IDAsIHk6IDAsXG4gIH07XG4gIC8vIOe7k+WxgOS4pOS4quaJi+aMhyA9PiDkuIDkuKrmiYvmjIflkI7vvIzpobXpnaLmipbliqjpl67pophcbiAgdG91Y2hlZEZpbmdlck51bSA9IDA7XG4gIC8vIOaYr+S4pOS4quaJi+aMhyA9PiDkuIDkuKrmiYvmjIdcbiAgaXNUb3cyT25lID0gZmFsc2U7XG4gIC8vIOijgeWIh+eahOmrmOW6plxuICBjbGlwQm90dG9tID0gMDtcbiAgLy8g5bem6L655bCP55CD6auY5bqmXG4gIGxlZnRQb2ludFkgPSAwO1xuICAvLyDliIblibLnur/lt6bovrnpq5jluqZcbiAgcmlnaHRQb2ludFkgPSAwO1xuICAvLyDliIblibLnur/lj7Povrnpq5jluqZcbiAgcm90YXRlTnVtID0gMDtcbiAgLy8g5biD5bGA5pa55byPXG4gIGxheW91dE1vZGUgPSAnJztcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIC8vIOmFjee9rumhuVxuICBwdWJsaWMgY29uZmlnKHtcbiAgICBjYW52YXMsIGN0eCwgaW1hZ2UsIGNsaXBCb3R0b20sIHdyYXBwZXJDdHgsIGFscGhhTnVtLFxuICAgIGxheW91dE1vZGVcbiAgfTogYW55KSB7XG4gICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgdGhpcy5pbWFnZSA9IGltYWdlO1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMuc3lzdGVtSW5mbyA9IHd4LmdldFN5c3RlbUluZm9TeW5jKCk7XG4gICAgdGhpcy5jbGlwQm90dG9tID0gY2xpcEJvdHRvbTtcbiAgICB0aGlzLndyYXBwZXJDdHggPSB3cmFwcGVyQ3R4O1xuICAgIHRoaXMubGVmdFBvaW50WSA9IGNsaXBCb3R0b207XG4gICAgdGhpcy5yaWdodFBvaW50WSA9IGNsaXBCb3R0b207XG4gICAgdGhpcy5nbG9iYWxBbHBoYSA9IGFscGhhTnVtO1xuICAgIHRoaXMubGF5b3V0TW9kZSA9IGxheW91dE1vZGU7XG4gIH1cblxuICAvLyDliJ3lp4vljJZcbiAgcHVibGljIGFzeW5jIGluaXQoKSB7XG4gICAgLy8g6I635Y+WY2F25Zu+54mH5a+56LGhXG4gICAgYXdhaXQgdGhpcy5fbG9hZENhdkltYWdlKCk7XG5cbiAgICAvLyDoo4Xovb3lm77niYfkv6Hmga/lr7nosaFcbiAgICBhd2FpdCB0aGlzLl9sb2FkSW1hZ2VJbmZvKCk7XG5cbiAgICBpZiAodGhpcy5sYXlvdXRNb2RlID09PSAnb2xkLWRvd24nKSB7XG4gICAgICB0aGlzLm1vdmVDdXJyZW50UG9pbnQgPSB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IHRoaXMucmlnaHRQb2ludFlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyDlvIDlp4vnu5jliLZcbiAgcHVibGljIHN0YXJ0RHJhdyhjbGlwOiBib29sZWFuKSB7XG4gICAgdGhpcy5kcmF3KHsgY2xpcCB9KTtcbiAgfVxuXG4gIC8vIOenu+WKqOW8gOWni1xuICBtb3ZlU3RhcnQoZTogYW55KSB7XG4gICAgdGhpcy50b3VjaGVkRmluZ2VyTnVtID0gMTtcblxuICAgIHRoaXMubW92ZU9sZFBvaW50ID0ge1xuICAgICAgeDogZS50b3VjaGVzWzBdLmNsaWVudFgsXG4gICAgICB5OiBlLnRvdWNoZXNbMF0uY2xpZW50WVxuICAgIH1cbiAgfVxuXG4gIC8vIOenu+WKqOS4rVxuICBtb3ZlKGU6IGFueSkge1xuICAgIGlmICh0aGlzLmlzVG93Mk9uZSkgcmV0dXJuO1xuXG4gICAgY29uc3QgZGlmZlggPSBlLnRvdWNoZXNbMF0uY2xpZW50WCAtIHRoaXMubW92ZU9sZFBvaW50Lng7XG4gICAgY29uc3QgZGlmZlkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WSAtIHRoaXMubW92ZU9sZFBvaW50Lnk7XG5cbiAgICBsZXQgbW92ZWRYID0gdGhpcy5tb3ZlQ3VycmVudFBvaW50LnggKyBkaWZmWDtcbiAgICBsZXQgbW92ZWRZID0gdGhpcy5tb3ZlQ3VycmVudFBvaW50LnkgKyBkaWZmWTtcblxuICAgIC8vIOW9k+WJjeWOn+eCueWdkOagh1xuICAgIHRoaXMubW92ZUN1cnJlbnRQb2ludCA9IHtcbiAgICAgIHg6IG1vdmVkWCxcbiAgICAgIHk6IG1vdmVkWVxuICAgIH1cblxuICAgIHRoaXMubW92ZU9sZFBvaW50ID0ge1xuICAgICAgeDogZS50b3VjaGVzWzBdLmNsaWVudFgsXG4gICAgICB5OiBlLnRvdWNoZXNbMF0uY2xpZW50WVxuICAgIH1cblxuICAgIHRoaXMuZHJhdyh7IGNsaXA6IGZhbHNlIH0pO1xuICB9XG5cbiAgLy8g57yp5pS+5byA5aeLXG4gIHpvb21TdGFydChlOiBhbnkpIHtcbiAgICB0aGlzLnRvdWNoZWRGaW5nZXJOdW0gPSAyO1xuXG4gICAgY29uc3QgdG91Y2gwID0gZS50b3VjaGVzWzBdO1xuICAgIGNvbnN0IHRvdWNoMSA9IGUudG91Y2hlc1sxXTtcblxuICAgIHRoaXMuZGlzdGFuY2UgPSB0aGlzLl9jYWxjRGlzdGFuY2UodG91Y2gwLCB0b3VjaDEpO1xuICAgIHRoaXMuY2VudGVyUG9pbnQgPSB7XG4gICAgICB4OiAodG91Y2gwLmNsaWVudFggKyB0b3VjaDEuY2xpZW50WCkgLyAyLFxuICAgICAgeTogKHRvdWNoMC5jbGllbnRZICsgdG91Y2gxLmNsaWVudFkpIC8gMlxuICAgIH1cbiAgfVxuXG4gIC8vIOe8qeaUvuS4rVxuICB6b29tTW92ZShlOiBhbnkpIHtcbiAgICBjb25zdCB0b3VjaDAgPSBlLnRvdWNoZXNbMF07XG4gICAgY29uc3QgdG91Y2gxID0gZS50b3VjaGVzWzFdO1xuXG4gICAgLy8g5b2T5YmN5Lik5Liq5omL5oyH5LmL6Ze055qE6Led56a7XG4gICAgY29uc3QgZGlzdGFuY2UgPSB0aGlzLl9jYWxjRGlzdGFuY2UodG91Y2gwLCB0b3VjaDEpO1xuICAgIGNvbnN0IGRpc3RhbmNlRGlmZiA9IGRpc3RhbmNlIC0gdGhpcy5kaXN0YW5jZTtcblxuICAgIC8vIOiuoeeul+e8qeaUvuWAvFxuICAgIGxldCBuZXdTY2FsZSA9IHRoaXMuc2NhbGUgKyAwLjAwNSAqIGRpc3RhbmNlRGlmZjtcbiAgICBpZiAobmV3U2NhbGUgPj0gMikge1xuICAgICAgbmV3U2NhbGUgPSAyO1xuICAgIH1cbiAgICBpZiAobmV3U2NhbGUgPD0gMC4zKSB7XG4gICAgICBuZXdTY2FsZSA9IDAuMztcbiAgICB9XG5cbiAgICB0aGlzLmRpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgdGhpcy5zY2FsZSA9IG5ld1NjYWxlO1xuXG4gICAgdGhpcy5kcmF3KHsgY2xpcDogZmFsc2UgfSk7XG4gIH1cblxuICAvLyDop6bmkbjnu5PmnZ9cbiAgdG91Y2hFbmQoKSB7XG4gICAgaWYgKHRoaXMudG91Y2hlZEZpbmdlck51bSA9PT0gMikge1xuICAgICAgdGhpcy5pc1RvdzJPbmUgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy50b3VjaGVkRmluZ2VyTnVtID09PSAxKSB7XG4gICAgICB0aGlzLmlzVG93Mk9uZSA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLnRvdWNoZWRGaW5nZXJOdW0gLT0gMTtcblxuICAgIHRoaXMuZHJhdyh7IGNsaXA6IHRydWUgfSk7XG4gIH1cblxuICAvLyDml4vovaxcbiAgcm90YXRlKHJvdGF0ZU51bTogbnVtYmVyID0gMCkge1xuICAgIHRoaXMucm90YXRlTnVtICs9IDQ1O1xuXG4gICAgaWYgKHRoaXMucm90YXRlTnVtID09PSAzNjApIHtcbiAgICAgIHRoaXMucm90YXRlTnVtID0gMFxuICAgIH1cblxuICAgIC8vIOWOu+e7mOWItlxuICAgIHRoaXMuZHJhdyh7XG4gICAgICBjbGlwOiB0cnVlXG4gICAgfSlcbiAgfVxuXG4gIC8vIOe7mOWItuS4u+eFp+eJh1xuICBwdWJsaWMgZHJhdyh7XG4gICAgY2xpcCA9IGZhbHNlXG4gIH0pIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCB7IHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQgfSA9IHRoaXMuc3lzdGVtSW5mbztcbiAgICBjb25zdCB7XG4gICAgICBjb29yZGluYXRlWCwgLy8g5Y6f54K55bmz56e755qEWFxuICAgICAgY29vcmRpbmF0ZVksIC8vIOWOn+eCueW5s+enu+eahFlcbiAgICAgIGR4LCAvLyDlm77niYfnu5jliLblt6bkuIrop5JYXG4gICAgICBkeSwgLy8g5Zu+54mH57uY5Yi25bem5LiK6KeSWVxuICAgICAgaW1nVywgLy8g5Zu+54mH5a695bqmXG4gICAgICBpbWdIIC8vIOWbvueJh+mrmOW6plxuICAgIH0gPSB0aGlzLl9jYWxjRHJhd1Bvc2l0aW9uKCk7XG5cbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQpO1xuICAgIGN0eC5nbG9iYWxBbHBoYSA9IHRoaXMuZ2xvYmFsQWxwaGE7XG5cbiAgICBpZiAoY2xpcCkge1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIHRoaXMuX2RyYXdQcmV2aWV3UmVjdChjdHgpO1xuICAgICAgY3R4LmNsaXAoKTtcbiAgICAgIC8vIGN0eC5yZXN0b3JlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2RyYXdQcmV2aWV3UmVjdChjdHgpO1xuICAgIH1cblxuICAgIC8vIOWFiOS/neWtmOaXp+eahOWdkOagh+ezu+eKtuaAgVxuICAgIGN0eC5zYXZlKCk7XG4gICAgLy8g5bCG5Y6f54K556e75Yqo5Yiw5Zu+54mH5Lit5b+DXG4gICAgY3R4LnRyYW5zbGF0ZShjb29yZGluYXRlWCwgY29vcmRpbmF0ZVkpO1xuXG4gICAgLy8g5peL6L2s5Z2Q5qCH57O7XG4gICAgY3R4LnJvdGF0ZSh0aGlzLnJvdGF0ZU51bSAqIE1hdGguUEkgLyAxODApO1xuICAgIC8vIOWkjeWOn+WdkOagh+ezu1xuICAgIGN0eC50cmFuc2xhdGUoLWNvb3JkaW5hdGVYLCAtY29vcmRpbmF0ZVkpO1xuXG4gICAgLy8g57uY5Yi25Zu+54mHXG4gICAgY3R4LmRyYXdJbWFnZSh0aGlzLmNhdkltYWdlLCBkeCwgZHksIGltZ1csIGltZ0gpO1xuICAgIC8vIOi/mOWOn1xuICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG4gIC8vIOe7mOWItumBrue9qeWxglxuICBwdWJsaWMgZHJhd0NvdmVyKGxlZnRZOiBudW1iZXIgPSB0aGlzLmxlZnRQb2ludFksIHJpZ2h0WTogbnVtYmVyID0gdGhpcy5yaWdodFBvaW50WSkge1xuICAgIHRoaXMubGVmdFBvaW50WSA9IGxlZnRZO1xuICAgIHRoaXMucmlnaHRQb2ludFkgPSByaWdodFk7XG5cbiAgICBjb25zdCB7IHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQgfSA9IHRoaXMuc3lzdGVtSW5mbztcblxuICAgIGNvbnN0IGN0eCA9IHRoaXMud3JhcHBlckN0eDtcblxuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgd2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5saW5lVG8od2luZG93V2lkdGgsIHRoaXMucmlnaHRQb2ludFkpO1xuICAgIGN0eC5saW5lVG8oMCwgdGhpcy5sZWZ0UG9pbnRZKTtcbiAgICBjdHgubGluZVdpZHRoID0gMjtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSAnI2ZmZic7XG4gICAgY3R4LnN0cm9rZSgpO1xuICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRHbG9iYWxBbHBoYShhbHBoYTogbnVtYmVyKSB7XG4gICAgdGhpcy5nbG9iYWxBbHBoYSA9IGFscGhhO1xuICAgIHRoaXMuZHJhdyh7IGNsaXA6IHRydWUgfSk7XG4gIH1cblxuICBwdWJsaWMgc2V0Um90YXRlKHJvdGF0ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5yb3RhdGVOdW0gPSByb3RhdGU7XG4gICAgLy8gdGhpcy5kcmF3KHsgY2xpcDogdHJ1ZSB9KTtcbiAgICB0aGlzLnJlc2V0VG9DZW50ZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyByZXNldFRvQ2VudGVyKCkge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIC8vIOe8qeaUvuS4ujFcbiAgICB0aGlzLnNjYWxlID0gMTtcblxuICAgIGNvbnN0IHsgd2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCB9ID0gdGhpcy5zeXN0ZW1JbmZvO1xuICAgIGNvbnN0IHsgd2lkdGg6IGltYWdlQmFzZVdpZHRoLCBoZWlnaHQ6IGltYWdlQmFzZUhlaWdodCB9ID0gdGhpcy5pbWFnZUluZm87XG5cbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQpO1xuXG4gICAgY3R4LnNhdmUoKTtcbiAgICB0aGlzLl9kcmF3UHJldmlld1JlY3QoY3R4KTtcbiAgICBjdHguY2xpcCgpO1xuXG4gICAgY29uc3QgY29vcmRpbmF0ZVggPSB3aW5kb3dXaWR0aCAvIDI7XG4gICAgbGV0IHJpZ2h0UG9pbnRZID0gdGhpcy5yaWdodFBvaW50WTtcbiAgICAvLyDlhbzlrrnkuKTnp43mqKHlvI9cbiAgICBpZiAodGhpcy5sYXlvdXRNb2RlID09PSAnb2xkLWRvd24nKSB7XG4gICAgICByaWdodFBvaW50WSA9ICh0aGlzLnJpZ2h0UG9pbnRZICsgKHdpbmRvd0hlaWdodCAtIDgwIC0gcmlnaHRQb2ludFkpIC8gMikgKiAyO1xuICAgIH1cblxuICAgIGNvbnN0IGNvb3JkaW5hdGVZID0gcmlnaHRQb2ludFkgLyAyO1xuXG4gICAgLy8g5YWI5L+d5a2Y5pen55qE5Z2Q5qCH57O754q25oCBXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIC8vIOWwhuWOn+eCueenu+WKqOWIsOeUu+W4g+S4reW/g1xuICAgIGN0eC50cmFuc2xhdGUoY29vcmRpbmF0ZVgsIGNvb3JkaW5hdGVZKTtcblxuICAgIGN0eC5yb3RhdGUodGhpcy5yb3RhdGVOdW0gKiBNYXRoLlBJIC8gMTgwKTtcblxuICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5jYXZJbWFnZSwgLWltYWdlQmFzZVdpZHRoIC8gMiwgLWltYWdlQmFzZUhlaWdodCAvIDIsIGltYWdlQmFzZVdpZHRoLCBpbWFnZUJhc2VIZWlnaHQpO1xuXG4gICAgdGhpcy5tb3ZlQ3VycmVudFBvaW50ID0ge1xuICAgICAgeDogLWltYWdlQmFzZVdpZHRoIC8gMiArIGNvb3JkaW5hdGVYLFxuICAgICAgeTogLWltYWdlQmFzZUhlaWdodCAvIDIgKyBjb29yZGluYXRlWVxuICAgIH1cblxuICAgIHRoaXMuY2VudGVyUG9pbnQgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICBfY2FsY0RyYXdQb3NpdGlvbigpIHtcbiAgICBjb25zdCB7IHdpZHRoOiBpbWFnZUJhc2VXaWR0aCwgaGVpZ2h0OiBpbWFnZUJhc2VIZWlnaHQgfSA9IHRoaXMuaW1hZ2VJbmZvO1xuXG4gICAgY29uc3QgY2VudGVyWCA9IHRoaXMuY2VudGVyUG9pbnQueDtcbiAgICBjb25zdCBjZW50ZXJZID0gdGhpcy5jZW50ZXJQb2ludC55O1xuXG4gICAgY29uc3QgdyA9IGNlbnRlclggLSB0aGlzLm1vdmVDdXJyZW50UG9pbnQueDtcbiAgICBjb25zdCBoID0gY2VudGVyWSAtIHRoaXMubW92ZUN1cnJlbnRQb2ludC55O1xuXG4gICAgLy8g6K6h566X57yp5pS+5ZCO55qE5bem5LiK6KeS5Z2Q5qCHXG4gICAgY29uc3QgZHggPSBjZW50ZXJYIC0gdyAqIHRoaXMuc2NhbGVcbiAgICBjb25zdCBkeSA9IGNlbnRlclkgLSBoICogdGhpcy5zY2FsZTtcblxuICAgIC8vIOWbvueJh+e8qeaUvuWQjueahOWuvemrmFxuICAgIGNvbnN0IGltZ1cgPSB0aGlzLnNjYWxlICogKGltYWdlQmFzZVdpZHRoIHx8IDEpO1xuICAgIGNvbnN0IGltZ0ggPSB0aGlzLnNjYWxlICogKGltYWdlQmFzZUhlaWdodCB8fCAxKTtcblxuICAgIC8vIOaJvuWIsOijgeWJquWMuuWfn+S4reW/g+eCuVxuICAgIGNvbnN0IGNvb3JkaW5hdGVYID0gZHggKyBpbWdXIC8gMjtcbiAgICBjb25zdCBjb29yZGluYXRlWSA9IGR5ICsgaW1nSCAvIDI7XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29vcmRpbmF0ZVgsXG4gICAgICBjb29yZGluYXRlWSxcbiAgICAgIGR4LFxuICAgICAgZHksXG4gICAgICBpbWdXLFxuICAgICAgaW1nSFxuICAgIH1cbiAgfVxuXG4gIF9kcmF3UHJldmlld1JlY3QoY3R4OiBhbnksIGNvbmZpZzogYW55ID0ge30pIHtcbiAgICBjb25zdCB7IHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQgfSA9IHRoaXMuc3lzdGVtSW5mbztcbiAgICBjb25zdCB7IGxpbmVXaWR0aCwgc3Ryb2tlU3R5bGUgfSA9IGNvbmZpZztcblxuICAgIGN0eC5iZWdpblBhdGgoKTtcblxuICAgIGlmICh0aGlzLmxheW91dE1vZGUgPT09ICdvbGQtdG9wJykge1xuICAgICAgLy8g5bem5LiK6KeS54K5XG4gICAgICBjdHgubW92ZVRvKDAsIDApO1xuICAgICAgLy8g5Y+z5LiK6KeS54K5XG4gICAgICBjdHgubGluZVRvKHdpbmRvd1dpZHRoLCAwKTtcbiAgICAgIC8vIOWPs+S4i+inkueCuVxuICAgICAgY3R4LmxpbmVUbyh3aW5kb3dXaWR0aCwgdGhpcy5yaWdodFBvaW50WSk7XG4gICAgICAvLyDlt6bkuIvop5LngrlcbiAgICAgIGN0eC5saW5lVG8oMCwgdGhpcy5sZWZ0UG9pbnRZKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubGF5b3V0TW9kZSA9PT0gJ29sZC1kb3duJykge1xuICAgICAgLy8g5bem5LiK6KeS54K5XG4gICAgICBjdHgubW92ZVRvKDAsIHRoaXMubGVmdFBvaW50WSk7XG4gICAgICAvLyDlj7PkuIrop5LngrlcbiAgICAgIGN0eC5saW5lVG8od2luZG93V2lkdGgsIHRoaXMucmlnaHRQb2ludFkpO1xuICAgICAgLy8g5Y+z5LiL6KeS54K5XG4gICAgICBjdHgubGluZVRvKHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQgLSA4MCk7XG4gICAgICAvLyDlt6bkuIvop5LngrlcbiAgICAgIGN0eC5saW5lVG8oMCwgd2luZG93SGVpZ2h0IC0gODApO1xuICAgIH1cblxuICAgIC8vIOi+ueahhiAg6K6p5oiR556F556F5L2g55qE54mZXG4gICAgY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aCA/IGxpbmVXaWR0aCA6IDE7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gc3Ryb2tlU3R5bGUgPyBzdHJva2VTdHlsZSA6ICdyZ2IoMjU1LCAyNTUsIDI1NSknO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gIH1cblxuICBwcml2YXRlIF9sb2FkQ2F2SW1hZ2UoKSB7XG4gICAgY29uc3QgaW1nID0gdGhpcy5jYW52YXMuY3JlYXRlSW1hZ2UoKTtcbiAgICBpbWcuc3JjID0gdGhpcy5pbWFnZTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuY2F2SW1hZ2UgPSBpbWc7XG4gICAgICAgIHJlc29sdmUoaW1nKTtcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBfbG9hZEltYWdlSW5mbygpIHtcbiAgICBsZXQgeyB3aWR0aCwgaGVpZ2h0IH0gPSBhd2FpdCB0aGlzLl9nZXRJbWFnZUluZm8oKTtcbiAgICBjb25zdCB7IHdpbmRvd1dpZHRoIH0gPSB0aGlzLnN5c3RlbUluZm87XG5cbiAgICAvLyDlm77niYfov4flsI9cbiAgICBpZiAod2lkdGggPCB3aW5kb3dXaWR0aCkge1xuICAgICAgaGVpZ2h0ID0gaGVpZ2h0ICogd2luZG93V2lkdGggLyB3aWR0aFxuICAgICAgd2lkdGggPSB3aW5kb3dXaWR0aDtcbiAgICB9XG4gICAgLy8g5Zu+54mH6L+H5aSnXG4gICAgaWYgKHdpZHRoID4gd2luZG93V2lkdGgpIHtcbiAgICAgIGhlaWdodCA9IGhlaWdodCAqIHdpbmRvd1dpZHRoIC8gd2lkdGhcbiAgICAgIHdpZHRoID0gd2luZG93V2lkdGg7XG4gICAgfVxuXG4gICAgLy8gVE9ETzog5ZCO57ut5LyY5YyW77yM5a+85YWl55qE54Wn54mH6Ieq5Yqo5biD5bGAXG4gICAgLy8gLy8g5Zu+54mH6KeS5bqm77yM5b2T5piv56uW552A55qE54Wn54mH5pe277yM6Ieq5Yqo5peL6L2sOTDluqZcbiAgICAvLyBpZiAoaGVpZ2h0IDwgd2lkdGgpIHtcbiAgICAvLyAgIHRoaXMucm90YXRlTnVtID0gOTA7XG4gICAgLy8gfVxuXG4gICAgdGhpcy5pbWFnZUluZm8gPSB7XG4gICAgICB3aWR0aCwgaGVpZ2h0XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0SW1hZ2VJbmZvKCk6IFByb21pc2U8e1xuICAgIHdpZHRoOiBudW1iZXI7XG4gICAgaGVpZ2h0OiBudW1iZXJcbiAgfT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIC8vIOiOt+WPluWbvueJh+S/oeaBr1xuICAgICAgd3guZ2V0SW1hZ2VJbmZvKHtcbiAgICAgICAgc3JjOiB0aGlzLmltYWdlLFxuICAgICAgICBzdWNjZXNzOiAocmVzKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShyZXMpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBfY2FsY0Rpc3RhbmNlKHRvdWNoMDogYW55LCB0b3VjaDE6IGFueSkge1xuICAgIGNvbnN0IHhNb3ZlID0gdG91Y2gxLmNsaWVudFggLSB0b3VjaDAuY2xpZW50WDtcbiAgICBjb25zdCB5TW92ZSA9IHRvdWNoMS5jbGllbnRZIC0gdG91Y2gwLmNsaWVudFk7XG5cbiAgICAvLyDorrDlvZXmnIDliJ3nmoTkuKTkuKrmiYvmjIfpl7TnmoTljLrpl7TlgLxcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHhNb3ZlICogeE1vdmUgKyB5TW92ZSAqIHlNb3ZlKTtcbiAgfVxufTsiXX0=