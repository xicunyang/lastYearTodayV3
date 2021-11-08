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
        var _d = this._calcDrawPosition(), coordinateX = _d.coordinateX, coordinateY = _d.coordinateY, dx = _d.dx, dy = _d.dy, imgW = _d.imgW, imgH = _d.imgH;
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
        this.draw({ clip: true });
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
            var _a, width, height;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this._getImageInfo()];
                    case 1:
                        _a = _b.sent(), width = _a.width, height = _a.height;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2F2SW1hZ2VWMi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNhdkltYWdlVjIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBLE1BQU0sQ0FBQyxPQUFPO0lBZ0RaO1FBaENBLGdCQUFXLEdBQVcsR0FBRyxDQUFDO1FBRTFCLGlCQUFZLEdBQVE7WUFDbEIsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztTQUNYLENBQUM7UUFFRixxQkFBZ0IsR0FBUTtZQUN0QixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1NBQ1gsQ0FBQztRQUVGLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFFYixVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBRVYsZ0JBQVcsR0FBRztZQUNaLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDWCxDQUFDO1FBRUYscUJBQWdCLEdBQUcsQ0FBQyxDQUFDO1FBRXJCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFFbEIsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUVmLGVBQVUsR0FBRyxDQUFDLENBQUM7UUFFZixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUVoQixjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBRWQsZUFBVSxHQUFHLEVBQUUsQ0FBQztJQUVBLENBQUM7SUFHVix5QkFBTSxHQUFiLFVBQWMsRUFHUjtZQUZKLE1BQU0sWUFBQSxFQUFFLEdBQUcsU0FBQSxFQUFFLEtBQUssV0FBQSxFQUFFLFVBQVUsZ0JBQUEsRUFBRSxVQUFVLGdCQUFBLEVBQUUsUUFBUSxjQUFBLEVBQ3BELFVBQVUsZ0JBQUE7UUFFVixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7UUFDOUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7UUFDNUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDL0IsQ0FBQztJQUdZLHVCQUFJLEdBQWpCOzs7OzRCQUVFLFdBQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFBOzt3QkFBMUIsU0FBMEIsQ0FBQzt3QkFHM0IsV0FBTSxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUE7O3dCQUEzQixTQUEyQixDQUFDOzs7OztLQUM3QjtJQUdNLDRCQUFTLEdBQWhCLFVBQWlCLElBQWE7UUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBQSxFQUFFLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBR0QsNEJBQVMsR0FBVCxVQUFVLENBQU07UUFDZCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO1FBRTFCLElBQUksQ0FBQyxZQUFZLEdBQUc7WUFDbEIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztZQUN2QixDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPO1NBQ3hCLENBQUE7SUFDSCxDQUFDO0lBR0QsdUJBQUksR0FBSixVQUFLLENBQU07UUFDVCxJQUFJLElBQUksQ0FBQyxTQUFTO1lBQUUsT0FBTztRQUUzQixJQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUN6RCxJQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUV6RCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUM3QyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUc3QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUc7WUFDdEIsQ0FBQyxFQUFFLE1BQU07WUFDVCxDQUFDLEVBQUUsTUFBTTtTQUNWLENBQUE7UUFFRCxJQUFJLENBQUMsWUFBWSxHQUFHO1lBQ2xCLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU87WUFDdkIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztTQUN4QixDQUFBO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFHRCw0QkFBUyxHQUFULFVBQVUsQ0FBTTtRQUNkLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7UUFFMUIsSUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixJQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTVCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLFdBQVcsR0FBRztZQUNqQixDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO1lBQ3hDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7U0FDekMsQ0FBQTtJQUNILENBQUM7SUFHRCwyQkFBUSxHQUFSLFVBQVMsQ0FBTTtRQUNiLElBQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUIsSUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUc1QixJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwRCxJQUFNLFlBQVksR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUc5QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxZQUFZLENBQUM7UUFDakQsSUFBSSxRQUFRLElBQUksQ0FBQyxFQUFFO1lBQ2pCLFFBQVEsR0FBRyxDQUFDLENBQUM7U0FDZDtRQUNELElBQUksUUFBUSxJQUFJLEdBQUcsRUFBRTtZQUNuQixRQUFRLEdBQUcsR0FBRyxDQUFDO1NBQ2hCO1FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUM7UUFFdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFHRCwyQkFBUSxHQUFSO1FBQ0UsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFO1lBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1NBQ3ZCO2FBQU0sSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFO1lBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1NBQ3hCO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixJQUFJLENBQUMsQ0FBQztRQUUzQixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUdELHlCQUFNLEdBQU4sVUFBTyxTQUFxQjtRQUFyQiwwQkFBQSxFQUFBLGFBQXFCO1FBQzFCLElBQUksQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDO1FBRXJCLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxHQUFHLEVBQUU7WUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUE7U0FDbkI7UUFHRCxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ1IsSUFBSSxFQUFFLElBQUk7U0FDWCxDQUFDLENBQUE7SUFDSixDQUFDO0lBR00sdUJBQUksR0FBWCxVQUFZLEVBRVg7WUFEQyxZQUFZLEVBQVosSUFBSSxtQkFBRyxLQUFLLEtBQUE7UUFFWixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ2YsSUFBQSxLQUFnQyxJQUFJLENBQUMsVUFBVSxFQUE3QyxXQUFXLGlCQUFBLEVBQUUsWUFBWSxrQkFBb0IsQ0FBQztRQUV0RCxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQy9DLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUVuQyxJQUFJLElBQUksRUFBRTtZQUNSLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNYLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzQixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7U0FFWjthQUFNO1lBQ0wsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzVCO1FBRUssSUFBQSxLQU9GLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxFQU4xQixXQUFXLGlCQUFBLEVBQ1gsV0FBVyxpQkFBQSxFQUNYLEVBQUUsUUFBQSxFQUNGLEVBQUUsUUFBQSxFQUNGLElBQUksVUFBQSxFQUNKLElBQUksVUFDc0IsQ0FBQztRQUk3QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFWCxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUV4QyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUUzQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFMUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWpELEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVkLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBR00sNEJBQVMsR0FBaEIsVUFBaUIsS0FBK0IsRUFBRSxNQUFpQztRQUFsRSxzQkFBQSxFQUFBLFFBQWdCLElBQUksQ0FBQyxVQUFVO1FBQUUsdUJBQUEsRUFBQSxTQUFpQixJQUFJLENBQUMsV0FBVztRQUNqRixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztRQUVwQixJQUFBLEtBQWdDLElBQUksQ0FBQyxVQUFVLEVBQTdDLFdBQVcsaUJBQUEsRUFBRSxZQUFZLGtCQUFvQixDQUFDO1FBRXRELElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFFNUIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUMvQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvQixHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNsQixHQUFHLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztRQUN6QixHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDYixHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVNLGlDQUFjLEdBQXJCLFVBQXNCLEtBQWE7UUFDakMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFTSw0QkFBUyxHQUFoQixVQUFpQixNQUFjO1FBQzdCLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsb0NBQWlCLEdBQWpCO1FBQ1EsSUFBQSxLQUFxRCxJQUFJLENBQUMsU0FBUyxFQUExRCxjQUFjLFdBQUEsRUFBVSxlQUFlLFlBQW1CLENBQUM7UUFFMUUsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDbkMsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFFbkMsSUFBTSxDQUFDLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDNUMsSUFBTSxDQUFDLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFHNUMsSUFBTSxFQUFFLEdBQUcsT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBO1FBQ25DLElBQU0sRUFBRSxHQUFHLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUdwQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsY0FBYyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2hELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxlQUFlLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFakQsSUFBTSxXQUFXLEdBQUcsRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7UUFDbEMsSUFBTSxXQUFXLEdBQUcsRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7UUFFbEMsT0FBTztZQUNMLFdBQVcsYUFBQTtZQUNYLFdBQVcsYUFBQTtZQUNYLEVBQUUsSUFBQTtZQUNGLEVBQUUsSUFBQTtZQUNGLElBQUksTUFBQTtZQUNKLElBQUksTUFBQTtTQUNMLENBQUE7SUFDSCxDQUFDO0lBRUQsbUNBQWdCLEdBQWhCLFVBQWlCLEdBQVEsRUFBRSxNQUFnQjtRQUFoQix1QkFBQSxFQUFBLFdBQWdCO1FBQ25DLElBQUEsS0FBZ0MsSUFBSSxDQUFDLFVBQVUsRUFBN0MsV0FBVyxpQkFBQSxFQUFFLFlBQVksa0JBQW9CLENBQUM7UUFDOUMsSUFBQSxTQUFTLEdBQWtCLE1BQU0sVUFBeEIsRUFBRSxXQUFXLEdBQUssTUFBTSxZQUFYLENBQVk7UUFFMUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRWhCLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUU7WUFFakMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFakIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFM0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRTFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNoQzthQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxVQUFVLEVBQUU7WUFFekMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRS9CLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUUxQyxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxZQUFZLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFFM0MsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsWUFBWSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1NBQ2xDO1FBR0QsR0FBRyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDO1FBQ25FLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNiLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRU8sZ0NBQWEsR0FBckI7UUFBQSxpQkFVQztRQVRDLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdEMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRXJCLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQSxPQUFPO1lBQ3hCLEdBQUcsQ0FBQyxNQUFNLEdBQUc7Z0JBQ1gsS0FBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7Z0JBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNmLENBQUMsQ0FBQTtRQUNILENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVhLGlDQUFjLEdBQTVCOzs7Ozs0QkFDNEIsV0FBTSxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUE7O3dCQUE5QyxLQUFvQixTQUEwQixFQUE1QyxLQUFLLFdBQUEsRUFBRSxNQUFNLFlBQUE7d0JBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUc7NEJBQ2YsS0FBSyxPQUFBLEVBQUUsTUFBTSxRQUFBO3lCQUNkLENBQUE7Ozs7O0tBQ0Y7SUFFTyxnQ0FBYSxHQUFyQjtRQUFBLGlCQWFDO1FBVEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFBLE9BQU87WUFFeEIsRUFBRSxDQUFDLFlBQVksQ0FBQztnQkFDZCxHQUFHLEVBQUUsS0FBSSxDQUFDLEtBQUs7Z0JBQ2YsT0FBTyxFQUFFLFVBQUMsR0FBRztvQkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2YsQ0FBQzthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELGdDQUFhLEdBQWIsVUFBYyxNQUFXLEVBQUUsTUFBVztRQUNwQyxJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDOUMsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBRzlDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUFyV2dCLEdBcVdoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW50ZXJmYWNlIElNb3ZlT2xkUG9pbnQge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBDYXZJbWFnZSB7XG4gIC8vIOS4u2NhbnZhc1xuICBjYW52YXM6IGFueTtcbiAgLy8g5Li7Y3R4XG4gIGN0eDogYW55O1xuICAvLyDpga7nvanlsYJjdHhcbiAgd3JhcHBlckN0eDogYW55O1xuICAvLyDlm77niYdcbiAgaW1hZ2U6IGFueTtcbiAgLy8g5Zu+54mH5L+h5oGvXG4gIGltYWdlSW5mbzogYW55O1xuICAvLyDlm77niYcgPT4gY2FudmFzXG4gIGNhdkltYWdlOiBhbnk7XG4gIC8vIOezu+e7n+WjsOmfs1xuICBzeXN0ZW1JbmZvOiBhbnk7XG4gIC8vIGNhbnZhc+mAj+aYjuW6plxuICBnbG9iYWxBbHBoYTogbnVtYmVyID0gMC42O1xuICAvLyDnp7vliqjngrkgLSDml6dcbiAgbW92ZU9sZFBvaW50OiBhbnkgPSB7XG4gICAgeDogMCwgeTogMFxuICB9O1xuICAvLyDlm77niYflt6bkuIrop5LngrlcbiAgbW92ZUN1cnJlbnRQb2ludDogYW55ID0ge1xuICAgIHg6IDAsIHk6IDBcbiAgfTtcbiAgLy8g5Lik5Liq5omL5oyH6KeB55qE6Led56a7XG4gIGRpc3RhbmNlID0gMDtcbiAgLy8g57yp5pS+5YC8XG4gIHNjYWxlID0gMTtcbiAgLy8g5Lik5Liq5omL5oyH55qE5Lit5b+D54K5XG4gIGNlbnRlclBvaW50ID0ge1xuICAgIHg6IDAsIHk6IDAsXG4gIH07XG4gIC8vIOe7k+WxgOS4pOS4quaJi+aMhyA9PiDkuIDkuKrmiYvmjIflkI7vvIzpobXpnaLmipbliqjpl67pophcbiAgdG91Y2hlZEZpbmdlck51bSA9IDA7XG4gIC8vIOaYr+S4pOS4quaJi+aMhyA9PiDkuIDkuKrmiYvmjIdcbiAgaXNUb3cyT25lID0gZmFsc2U7XG4gIC8vIOijgeWIh+eahOmrmOW6plxuICBjbGlwQm90dG9tID0gMDtcbiAgLy8g5bem6L655bCP55CD6auY5bqmXG4gIGxlZnRQb2ludFkgPSAwO1xuICAvLyDliIblibLnur/lt6bovrnpq5jluqZcbiAgcmlnaHRQb2ludFkgPSAwO1xuICAvLyDliIblibLnur/lj7Povrnpq5jluqZcbiAgcm90YXRlTnVtID0gMDtcbiAgLy8g5biD5bGA5pa55byPXG4gIGxheW91dE1vZGUgPSAnJztcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIC8vIOmFjee9rumhuVxuICBwdWJsaWMgY29uZmlnKHtcbiAgICBjYW52YXMsIGN0eCwgaW1hZ2UsIGNsaXBCb3R0b20sIHdyYXBwZXJDdHgsIGFscGhhTnVtLFxuICAgIGxheW91dE1vZGVcbiAgfTogYW55KSB7XG4gICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgdGhpcy5pbWFnZSA9IGltYWdlO1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMuc3lzdGVtSW5mbyA9IHd4LmdldFN5c3RlbUluZm9TeW5jKCk7XG4gICAgdGhpcy5jbGlwQm90dG9tID0gY2xpcEJvdHRvbTtcbiAgICB0aGlzLndyYXBwZXJDdHggPSB3cmFwcGVyQ3R4O1xuICAgIHRoaXMubGVmdFBvaW50WSA9IGNsaXBCb3R0b207XG4gICAgdGhpcy5yaWdodFBvaW50WSA9IGNsaXBCb3R0b207XG4gICAgdGhpcy5nbG9iYWxBbHBoYSA9IGFscGhhTnVtO1xuICAgIHRoaXMubGF5b3V0TW9kZSA9IGxheW91dE1vZGU7XG4gIH1cblxuICAvLyDliJ3lp4vljJZcbiAgcHVibGljIGFzeW5jIGluaXQoKSB7XG4gICAgLy8g6I635Y+WY2F25Zu+54mH5a+56LGhXG4gICAgYXdhaXQgdGhpcy5fbG9hZENhdkltYWdlKCk7XG5cbiAgICAvLyDoo4Xovb3lm77niYfkv6Hmga/lr7nosaFcbiAgICBhd2FpdCB0aGlzLl9sb2FkSW1hZ2VJbmZvKCk7XG4gIH1cblxuICAvLyDlvIDlp4vnu5jliLZcbiAgcHVibGljIHN0YXJ0RHJhdyhjbGlwOiBib29sZWFuKSB7XG4gICAgdGhpcy5kcmF3KHsgY2xpcCB9KTtcbiAgfVxuXG4gIC8vIOenu+WKqOW8gOWni1xuICBtb3ZlU3RhcnQoZTogYW55KSB7XG4gICAgdGhpcy50b3VjaGVkRmluZ2VyTnVtID0gMTtcblxuICAgIHRoaXMubW92ZU9sZFBvaW50ID0ge1xuICAgICAgeDogZS50b3VjaGVzWzBdLmNsaWVudFgsXG4gICAgICB5OiBlLnRvdWNoZXNbMF0uY2xpZW50WVxuICAgIH1cbiAgfVxuXG4gIC8vIOenu+WKqOS4rVxuICBtb3ZlKGU6IGFueSkge1xuICAgIGlmICh0aGlzLmlzVG93Mk9uZSkgcmV0dXJuO1xuXG4gICAgY29uc3QgZGlmZlggPSBlLnRvdWNoZXNbMF0uY2xpZW50WCAtIHRoaXMubW92ZU9sZFBvaW50Lng7XG4gICAgY29uc3QgZGlmZlkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WSAtIHRoaXMubW92ZU9sZFBvaW50Lnk7XG5cbiAgICBsZXQgbW92ZWRYID0gdGhpcy5tb3ZlQ3VycmVudFBvaW50LnggKyBkaWZmWDtcbiAgICBsZXQgbW92ZWRZID0gdGhpcy5tb3ZlQ3VycmVudFBvaW50LnkgKyBkaWZmWTtcblxuICAgIC8vIOW9k+WJjeWOn+eCueWdkOagh1xuICAgIHRoaXMubW92ZUN1cnJlbnRQb2ludCA9IHtcbiAgICAgIHg6IG1vdmVkWCxcbiAgICAgIHk6IG1vdmVkWVxuICAgIH1cblxuICAgIHRoaXMubW92ZU9sZFBvaW50ID0ge1xuICAgICAgeDogZS50b3VjaGVzWzBdLmNsaWVudFgsXG4gICAgICB5OiBlLnRvdWNoZXNbMF0uY2xpZW50WVxuICAgIH1cblxuICAgIHRoaXMuZHJhdyh7IGNsaXA6IGZhbHNlIH0pO1xuICB9XG5cbiAgLy8g57yp5pS+5byA5aeLXG4gIHpvb21TdGFydChlOiBhbnkpIHtcbiAgICB0aGlzLnRvdWNoZWRGaW5nZXJOdW0gPSAyO1xuXG4gICAgY29uc3QgdG91Y2gwID0gZS50b3VjaGVzWzBdO1xuICAgIGNvbnN0IHRvdWNoMSA9IGUudG91Y2hlc1sxXTtcblxuICAgIHRoaXMuZGlzdGFuY2UgPSB0aGlzLl9jYWxjRGlzdGFuY2UodG91Y2gwLCB0b3VjaDEpO1xuICAgIHRoaXMuY2VudGVyUG9pbnQgPSB7XG4gICAgICB4OiAodG91Y2gwLmNsaWVudFggKyB0b3VjaDEuY2xpZW50WCkgLyAyLFxuICAgICAgeTogKHRvdWNoMC5jbGllbnRZICsgdG91Y2gxLmNsaWVudFkpIC8gMlxuICAgIH1cbiAgfVxuXG4gIC8vIOe8qeaUvuS4rVxuICB6b29tTW92ZShlOiBhbnkpIHtcbiAgICBjb25zdCB0b3VjaDAgPSBlLnRvdWNoZXNbMF07XG4gICAgY29uc3QgdG91Y2gxID0gZS50b3VjaGVzWzFdO1xuXG4gICAgLy8g5b2T5YmN5Lik5Liq5omL5oyH5LmL6Ze055qE6Led56a7XG4gICAgY29uc3QgZGlzdGFuY2UgPSB0aGlzLl9jYWxjRGlzdGFuY2UodG91Y2gwLCB0b3VjaDEpO1xuICAgIGNvbnN0IGRpc3RhbmNlRGlmZiA9IGRpc3RhbmNlIC0gdGhpcy5kaXN0YW5jZTtcblxuICAgIC8vIOiuoeeul+e8qeaUvuWAvFxuICAgIGxldCBuZXdTY2FsZSA9IHRoaXMuc2NhbGUgKyAwLjAwNSAqIGRpc3RhbmNlRGlmZjtcbiAgICBpZiAobmV3U2NhbGUgPj0gMikge1xuICAgICAgbmV3U2NhbGUgPSAyO1xuICAgIH1cbiAgICBpZiAobmV3U2NhbGUgPD0gMC4zKSB7XG4gICAgICBuZXdTY2FsZSA9IDAuMztcbiAgICB9XG5cbiAgICB0aGlzLmRpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgdGhpcy5zY2FsZSA9IG5ld1NjYWxlO1xuXG4gICAgdGhpcy5kcmF3KHsgY2xpcDogZmFsc2UgfSk7XG4gIH1cblxuICAvLyDop6bmkbjnu5PmnZ9cbiAgdG91Y2hFbmQoKSB7XG4gICAgaWYgKHRoaXMudG91Y2hlZEZpbmdlck51bSA9PT0gMikge1xuICAgICAgdGhpcy5pc1RvdzJPbmUgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy50b3VjaGVkRmluZ2VyTnVtID09PSAxKSB7XG4gICAgICB0aGlzLmlzVG93Mk9uZSA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLnRvdWNoZWRGaW5nZXJOdW0gLT0gMTtcblxuICAgIHRoaXMuZHJhdyh7IGNsaXA6IHRydWUgfSk7XG4gIH1cblxuICAvLyDml4vovaxcbiAgcm90YXRlKHJvdGF0ZU51bTogbnVtYmVyID0gMCkge1xuICAgIHRoaXMucm90YXRlTnVtICs9IDQ1O1xuXG4gICAgaWYgKHRoaXMucm90YXRlTnVtID09PSAzNjApIHtcbiAgICAgIHRoaXMucm90YXRlTnVtID0gMFxuICAgIH1cblxuICAgIC8vIOWOu+e7mOWItlxuICAgIHRoaXMuZHJhdyh7XG4gICAgICBjbGlwOiB0cnVlXG4gICAgfSlcbiAgfVxuXG4gIC8vIOe7mOWItuS4u+eFp+eJh1xuICBwdWJsaWMgZHJhdyh7XG4gICAgY2xpcCA9IGZhbHNlXG4gIH0pIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCB7IHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQgfSA9IHRoaXMuc3lzdGVtSW5mbztcblxuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgd2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCk7XG4gICAgY3R4Lmdsb2JhbEFscGhhID0gdGhpcy5nbG9iYWxBbHBoYTtcblxuICAgIGlmIChjbGlwKSB7XG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgdGhpcy5fZHJhd1ByZXZpZXdSZWN0KGN0eCk7XG4gICAgICBjdHguY2xpcCgpO1xuICAgICAgLy8gY3R4LnJlc3RvcmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZHJhd1ByZXZpZXdSZWN0KGN0eCk7XG4gICAgfVxuXG4gICAgY29uc3Qge1xuICAgICAgY29vcmRpbmF0ZVgsIC8vIOWOn+eCueW5s+enu+eahFhcbiAgICAgIGNvb3JkaW5hdGVZLCAvLyDljp/ngrnlubPnp7vnmoRZXG4gICAgICBkeCwgLy8g5Zu+54mH57uY5Yi25bem5LiK6KeSWFxuICAgICAgZHksIC8vIOWbvueJh+e7mOWItuW3puS4iuinkllcbiAgICAgIGltZ1csIC8vIOWbvueJh+WuveW6plxuICAgICAgaW1nSCAvLyDlm77niYfpq5jluqZcbiAgICB9ID0gdGhpcy5fY2FsY0RyYXdQb3NpdGlvbigpO1xuXG5cbiAgICAvLyDlhYjkv53lrZjml6fnmoTlnZDmoIfns7vnirbmgIFcbiAgICBjdHguc2F2ZSgpO1xuICAgIC8vIOWwhuWOn+eCueenu+WKqOWIsOWbvueJh+S4reW/g1xuICAgIGN0eC50cmFuc2xhdGUoY29vcmRpbmF0ZVgsIGNvb3JkaW5hdGVZKTtcbiAgICAvLyDml4vovazlnZDmoIfns7tcbiAgICBjdHgucm90YXRlKHRoaXMucm90YXRlTnVtICogTWF0aC5QSSAvIDE4MCk7XG4gICAgLy8g5aSN5Y6f5Z2Q5qCH57O7XG4gICAgY3R4LnRyYW5zbGF0ZSgtY29vcmRpbmF0ZVgsIC1jb29yZGluYXRlWSk7XG4gICAgLy8g57uY5Yi25Zu+54mHXG4gICAgY3R4LmRyYXdJbWFnZSh0aGlzLmNhdkltYWdlLCBkeCwgZHksIGltZ1csIGltZ0gpO1xuICAgIC8vIOi/mOWOn1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgLy8g57uY5Yi26YGu572p5bGCXG4gIHB1YmxpYyBkcmF3Q292ZXIobGVmdFk6IG51bWJlciA9IHRoaXMubGVmdFBvaW50WSwgcmlnaHRZOiBudW1iZXIgPSB0aGlzLnJpZ2h0UG9pbnRZKSB7XG4gICAgdGhpcy5sZWZ0UG9pbnRZID0gbGVmdFk7XG4gICAgdGhpcy5yaWdodFBvaW50WSA9IHJpZ2h0WTtcblxuICAgIGNvbnN0IHsgd2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCB9ID0gdGhpcy5zeXN0ZW1JbmZvO1xuXG4gICAgY29uc3QgY3R4ID0gdGhpcy53cmFwcGVyQ3R4O1xuXG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0KTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmxpbmVUbyh3aW5kb3dXaWR0aCwgdGhpcy5yaWdodFBvaW50WSk7XG4gICAgY3R4LmxpbmVUbygwLCB0aGlzLmxlZnRQb2ludFkpO1xuICAgIGN0eC5saW5lV2lkdGggPSAyO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9ICcjZmZmJztcbiAgICBjdHguc3Ryb2tlKCk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICB9XG5cbiAgcHVibGljIHNldEdsb2JhbEFscGhhKGFscGhhOiBudW1iZXIpIHtcbiAgICB0aGlzLmdsb2JhbEFscGhhID0gYWxwaGE7XG4gICAgdGhpcy5kcmF3KHsgY2xpcDogdHJ1ZSB9KTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRSb3RhdGUocm90YXRlOiBudW1iZXIpIHtcbiAgICB0aGlzLnJvdGF0ZU51bSA9IHJvdGF0ZTtcbiAgICB0aGlzLmRyYXcoeyBjbGlwOiB0cnVlIH0pO1xuICB9XG5cbiAgX2NhbGNEcmF3UG9zaXRpb24oKSB7XG4gICAgY29uc3QgeyB3aWR0aDogaW1hZ2VCYXNlV2lkdGgsIGhlaWdodDogaW1hZ2VCYXNlSGVpZ2h0IH0gPSB0aGlzLmltYWdlSW5mbztcblxuICAgIGNvbnN0IGNlbnRlclggPSB0aGlzLmNlbnRlclBvaW50Lng7XG4gICAgY29uc3QgY2VudGVyWSA9IHRoaXMuY2VudGVyUG9pbnQueTtcblxuICAgIGNvbnN0IHcgPSBjZW50ZXJYIC0gdGhpcy5tb3ZlQ3VycmVudFBvaW50Lng7XG4gICAgY29uc3QgaCA9IGNlbnRlclkgLSB0aGlzLm1vdmVDdXJyZW50UG9pbnQueTtcblxuICAgIC8vIOiuoeeul+e8qeaUvuWQjueahOW3puS4iuinkuWdkOagh1xuICAgIGNvbnN0IGR4ID0gY2VudGVyWCAtIHcgKiB0aGlzLnNjYWxlXG4gICAgY29uc3QgZHkgPSBjZW50ZXJZIC0gaCAqIHRoaXMuc2NhbGU7XG5cbiAgICAvLyDlm77niYfnvKnmlL7lkI7nmoTlrr3pq5hcbiAgICBjb25zdCBpbWdXID0gdGhpcy5zY2FsZSAqIChpbWFnZUJhc2VXaWR0aCB8fCAxKTtcbiAgICBjb25zdCBpbWdIID0gdGhpcy5zY2FsZSAqIChpbWFnZUJhc2VIZWlnaHQgfHwgMSk7XG5cbiAgICBjb25zdCBjb29yZGluYXRlWCA9IGR4ICsgaW1nVyAvIDI7XG4gICAgY29uc3QgY29vcmRpbmF0ZVkgPSBkeSArIGltZ0ggLyAyO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvb3JkaW5hdGVYLFxuICAgICAgY29vcmRpbmF0ZVksXG4gICAgICBkeCxcbiAgICAgIGR5LFxuICAgICAgaW1nVyxcbiAgICAgIGltZ0hcbiAgICB9XG4gIH1cblxuICBfZHJhd1ByZXZpZXdSZWN0KGN0eDogYW55LCBjb25maWc6IGFueSA9IHt9KSB7XG4gICAgY29uc3QgeyB3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0IH0gPSB0aGlzLnN5c3RlbUluZm87XG4gICAgY29uc3QgeyBsaW5lV2lkdGgsIHN0cm9rZVN0eWxlIH0gPSBjb25maWc7XG5cbiAgICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgICBpZiAodGhpcy5sYXlvdXRNb2RlID09PSAnb2xkLXRvcCcpIHtcbiAgICAgIC8vIOW3puS4iuinkueCuVxuICAgICAgY3R4Lm1vdmVUbygwLCAwKTtcbiAgICAgIC8vIOWPs+S4iuinkueCuVxuICAgICAgY3R4LmxpbmVUbyh3aW5kb3dXaWR0aCwgMCk7XG4gICAgICAvLyDlj7PkuIvop5LngrlcbiAgICAgIGN0eC5saW5lVG8od2luZG93V2lkdGgsIHRoaXMucmlnaHRQb2ludFkpO1xuICAgICAgLy8g5bem5LiL6KeS54K5XG4gICAgICBjdHgubGluZVRvKDAsIHRoaXMubGVmdFBvaW50WSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmxheW91dE1vZGUgPT09ICdvbGQtZG93bicpIHtcbiAgICAgIC8vIOW3puS4iuinkueCuVxuICAgICAgY3R4Lm1vdmVUbygwLCB0aGlzLmxlZnRQb2ludFkpO1xuICAgICAgLy8g5Y+z5LiK6KeS54K5XG4gICAgICBjdHgubGluZVRvKHdpbmRvd1dpZHRoLCB0aGlzLnJpZ2h0UG9pbnRZKTtcbiAgICAgIC8vIOWPs+S4i+inkueCuVxuICAgICAgY3R4LmxpbmVUbyh3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0IC0gODApO1xuICAgICAgLy8g5bem5LiL6KeS54K5XG4gICAgICBjdHgubGluZVRvKDAsIHdpbmRvd0hlaWdodCAtIDgwKTtcbiAgICB9XG5cbiAgICAvLyDovrnmoYYgIOiuqeaIkeeeheeeheS9oOeahOeJmVxuICAgIGN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGggPyBsaW5lV2lkdGggOiAxO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IHN0cm9rZVN0eWxlID8gc3Ryb2tlU3R5bGUgOiAncmdiKDI1NSwgMjU1LCAyNTUpJztcbiAgICBjdHguc3Ryb2tlKCk7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfbG9hZENhdkltYWdlKCkge1xuICAgIGNvbnN0IGltZyA9IHRoaXMuY2FudmFzLmNyZWF0ZUltYWdlKCk7XG4gICAgaW1nLnNyYyA9IHRoaXMuaW1hZ2U7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmNhdkltYWdlID0gaW1nO1xuICAgICAgICByZXNvbHZlKGltZyk7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgX2xvYWRJbWFnZUluZm8oKSB7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBhd2FpdCB0aGlzLl9nZXRJbWFnZUluZm8oKTtcbiAgICB0aGlzLmltYWdlSW5mbyA9IHtcbiAgICAgIHdpZHRoLCBoZWlnaHRcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZXRJbWFnZUluZm8oKTogUHJvbWlzZTx7XG4gICAgd2lkdGg6IG51bWJlcjtcbiAgICBoZWlnaHQ6IG51bWJlclxuICB9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgLy8g6I635Y+W5Zu+54mH5L+h5oGvXG4gICAgICB3eC5nZXRJbWFnZUluZm8oe1xuICAgICAgICBzcmM6IHRoaXMuaW1hZ2UsXG4gICAgICAgIHN1Y2Nlc3M6IChyZXMpID0+IHtcbiAgICAgICAgICByZXNvbHZlKHJlcyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIF9jYWxjRGlzdGFuY2UodG91Y2gwOiBhbnksIHRvdWNoMTogYW55KSB7XG4gICAgY29uc3QgeE1vdmUgPSB0b3VjaDEuY2xpZW50WCAtIHRvdWNoMC5jbGllbnRYO1xuICAgIGNvbnN0IHlNb3ZlID0gdG91Y2gxLmNsaWVudFkgLSB0b3VjaDAuY2xpZW50WTtcblxuICAgIC8vIOiusOW9leacgOWIneeahOS4pOS4quaJi+aMh+mXtOeahOWMuumXtOWAvFxuICAgIHJldHVybiBNYXRoLnNxcnQoeE1vdmUgKiB4TW92ZSArIHlNb3ZlICogeU1vdmUpO1xuICB9XG59OyJdfQ==