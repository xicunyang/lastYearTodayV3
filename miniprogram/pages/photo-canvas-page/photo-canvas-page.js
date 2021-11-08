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
var utils = require('./../../utils/util');
var CavImage = require('./../../entitiy/CavImageV2');
var AlphaEnum;
(function (AlphaEnum) {
    AlphaEnum[AlphaEnum["Low"] = 0.8] = "Low";
    AlphaEnum[AlphaEnum["Mid"] = 0.6] = "Mid";
    AlphaEnum[AlphaEnum["Height"] = 0.3] = "Height";
    AlphaEnum[AlphaEnum["All"] = 1] = "All";
})(AlphaEnum || (AlphaEnum = {}));
var LayoutMode;
(function (LayoutMode) {
    LayoutMode["OldTop"] = "old-top";
    LayoutMode["OldDown"] = "old-down";
})(LayoutMode || (LayoutMode = {}));
var MarginBottom = 0;
var choosedPhotoSrc = '';
var choosedCavImage = null;
var mainCanvas = null;
var mainCtx = null;
var wrapperCtx = null;
var leftBallTop = 0;
Page({
    data: {
        showCamera: false,
        isWrapperMode: false,
        systemInfo: {
            windowHeight: 0,
        },
        layoutMode: LayoutMode.OldTop,
        configBallTop: 0,
        initDone: false,
    },
    onLoad: function (options) {
        choosedPhotoSrc = options.picSrc;
        this.setData({
            layoutMode: options.layoutMode || LayoutMode.OldTop
        });
        wx.showLoading({
            title: '加载配置中'
        });
    },
    onShareAppMessage: function () {
        return getApp().globalData.sharedObj;
    },
    onShareTimeline: function () {
        return getApp().globalData.sharedObj;
    },
    onReady: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.init();
                if (choosedPhotoSrc) {
                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, this.initAllCanvas()];
                                case 1:
                                    _a.sent();
                                    return [4, this.initCavImage()];
                                case 2:
                                    _a.sent();
                                    choosedCavImage.startDraw(true);
                                    this.setData({
                                        showCamera: true
                                    });
                                    wx.hideLoading();
                                    this.setData({
                                        initDone: true
                                    });
                                    return [2];
                            }
                        });
                    }); }, 1000);
                }
                setTimeout(function () {
                    _this.setData({
                        showCamera: true
                    });
                    wx.hideLoading();
                }, 1000);
                return [2];
            });
        });
    },
    init: function () {
        var layoutMode = this.data.layoutMode;
        var configBallTop = 0;
        var windowHeight = wx.getSystemInfoSync().windowHeight;
        this.setData({
            systemInfo: wx.getSystemInfoSync()
        });
        if (layoutMode === LayoutMode.OldTop) {
            MarginBottom = windowHeight - 275;
            configBallTop = MarginBottom - 20;
        }
        else if (layoutMode === LayoutMode.OldDown) {
            MarginBottom = 200;
            configBallTop = 180;
        }
        this.setData({
            configBallTop: configBallTop
        });
        choosedCavImage = null;
        mainCanvas = null;
        mainCtx = null;
        wrapperCtx = null;
        leftBallTop = MarginBottom;
    },
    initAllCanvas: function () {
        var _this = this;
        var query = this.createSelectorQuery();
        var dpr = wx.getSystemInfoSync().pixelRatio;
        var main = new Promise(function (resolve) {
            query.select('#main-canvas')
                .fields({ node: true, size: true })
                .exec(function (res) { return __awaiter(_this, void 0, void 0, function () {
                var canvas, ctx;
                return __generator(this, function (_a) {
                    canvas = res[0].node;
                    canvas.width = res[0].width * dpr;
                    canvas.height = res[0].height * dpr;
                    ctx = canvas.getContext('2d');
                    ctx.scale(dpr, dpr);
                    mainCanvas = canvas;
                    mainCtx = ctx;
                    resolve(true);
                    return [2];
                });
            }); });
        });
        var wrapper = new Promise(function (resolve) {
            query.select('#wrapper-canvas')
                .fields({ node: true, size: true })
                .exec(function (res) { return __awaiter(_this, void 0, void 0, function () {
                var canvas, ctx;
                return __generator(this, function (_a) {
                    canvas = res[1].node;
                    canvas.width = res[1].width * dpr;
                    canvas.height = res[1].height * dpr;
                    ctx = canvas.getContext('2d');
                    ctx.scale(dpr, dpr);
                    wrapperCtx = ctx;
                    resolve(true);
                    return [2];
                });
            }); });
        });
        return Promise.all([main, wrapper]);
    },
    initCavImage: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        choosedCavImage = new CavImage();
                        choosedCavImage.config({
                            canvas: mainCanvas,
                            ctx: mainCtx,
                            image: choosedPhotoSrc,
                            clipBottom: MarginBottom,
                            wrapperCtx: wrapperCtx,
                            alphaNum: AlphaEnum.Mid,
                            layoutMode: this.data.layoutMode
                        });
                        return [4, choosedCavImage.init()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    },
    handleMainCavStart: function (e) {
        if (!this.data.initDone)
            return;
        var touchedFingerNum = e.touches.length;
        if (touchedFingerNum == 1) {
            choosedCavImage.moveStart(e);
        }
        else if (touchedFingerNum === 2) {
            choosedCavImage.zoomStart(e);
        }
    },
    handleMainCavMove: function (e) {
        if (!this.data.initDone)
            return;
        var touchedFingerNum = e.touches.length;
        if (touchedFingerNum == 1) {
            choosedCavImage.move(e);
        }
        else if (touchedFingerNum === 2) {
            choosedCavImage.zoomMove(e);
        }
    },
    handleMainCavEnd: function () {
        if (!this.data.initDone)
            return;
        choosedCavImage.touchEnd();
    },
    handleLeftBallMove: function (e) {
        if (!this.data.initDone)
            return;
        leftBallTop = e.y;
        choosedCavImage.drawCover(e.y, undefined);
        this._setWrapperMode(true);
    },
    handleLeftBallMoveEnd: function () {
        choosedCavImage.startDraw(true);
        this._setWrapperMode(false);
    },
    handleRightBallMove: function (e) {
        if (!this.data.initDone)
            return;
        choosedCavImage.drawCover(leftBallTop, e.y);
        this._setWrapperMode(true);
    },
    handleRightBallMoveEnd: function () {
        choosedCavImage.startDraw(true);
        this._setWrapperMode(false);
    },
    handleAlphaButtonClick: function () {
        if (!this.data.initDone)
            return;
        var alphaNum = choosedCavImage.globalAlpha;
        console.log('alphaNum:::', alphaNum);
        if (alphaNum === AlphaEnum.Mid) {
            alphaNum = AlphaEnum.Height;
            this._showToast('透明度高');
        }
        else if (alphaNum === AlphaEnum.Height) {
            alphaNum = AlphaEnum.Low;
            this._showToast('透明度低');
        }
        else if (alphaNum === AlphaEnum.Low) {
            alphaNum = AlphaEnum.Mid;
            this._showToast('透明度中等');
        }
        else {
            alphaNum = AlphaEnum.Mid;
            this._showToast('透明度中等');
        }
        choosedCavImage.setGlobalAlpha(alphaNum);
    },
    handleRotateClick: function () {
        if (!this.data.initDone)
            return;
        var rotateNum = choosedCavImage.rotateNum;
        rotateNum += 90;
        if (rotateNum >= 360) {
            rotateNum = 0;
        }
        this._showToast('旋转90度');
        choosedCavImage.setRotate(rotateNum);
    },
    handleTakePhoto: function () {
        var _this = this;
        if (!this.data.initDone)
            return;
        var camera = wx.createCameraContext();
        camera.takePhoto({
            quality: 'high',
            success: function (res) {
                var takePhotoSrc = res.tempImagePath;
                choosedCavImage.setGlobalAlpha(AlphaEnum.All);
                wx.canvasToTempFilePath({
                    canvas: mainCanvas,
                    fileType: 'png',
                    quality: 1,
                    success: function (res) {
                        var canvasPhotoSrc = res.tempFilePath;
                        wx.navigateTo({
                            url: "/pages/config-photo-page/config-photo-page?takePhotoSrc=" + takePhotoSrc + "&canvasPhotoSrc=" + canvasPhotoSrc,
                            events: {
                                handleBack: function () {
                                    choosedCavImage.setGlobalAlpha(AlphaEnum.Mid);
                                }
                            }
                        });
                    },
                    fail: function () {
                        _this._showErrorToast('旧图处理失败');
                    }
                });
            },
            fail: function () {
                _this._showErrorToast('照片拍摄失败');
            }
        });
    },
    _setWrapperMode: function (bool) {
        this.setData({
            isWrapperMode: bool,
        });
    },
    _showToast: function (title) {
        wx.showToast({
            title: title
        });
    },
    _showErrorToast: function (title) {
        wx.showToast({
            title: title,
            icon: 'error'
        });
    },
    _isOldDonw: function () {
        return this.data.layoutMode === LayoutMode.OldDown;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhvdG8tY2FudmFzLXBhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwaG90by1jYW52YXMtcGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDNUMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUE7QUFHdEQsSUFBSyxTQUtKO0FBTEQsV0FBSyxTQUFTO0lBQ1oseUNBQVMsQ0FBQTtJQUNULHlDQUFTLENBQUE7SUFDVCwrQ0FBWSxDQUFBO0lBQ1osdUNBQU8sQ0FBQTtBQUNULENBQUMsRUFMSSxTQUFTLEtBQVQsU0FBUyxRQUtiO0FBRUQsSUFBSyxVQUdKO0FBSEQsV0FBSyxVQUFVO0lBQ2IsZ0NBQWtCLENBQUE7SUFDbEIsa0NBQW9CLENBQUE7QUFDdEIsQ0FBQyxFQUhJLFVBQVUsS0FBVixVQUFVLFFBR2Q7QUFHRCxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFFckIsSUFBSSxlQUFlLEdBQVcsRUFBRSxDQUFDO0FBRWpDLElBQUksZUFBZSxHQUFRLElBQUksQ0FBQztBQUVoQyxJQUFJLFVBQVUsR0FBUSxJQUFJLENBQUM7QUFFM0IsSUFBSSxPQUFPLEdBQVEsSUFBSSxDQUFDO0FBRXhCLElBQUksVUFBVSxHQUFRLElBQUksQ0FBQztBQUUzQixJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFFcEIsSUFBSSxDQUFDO0lBSUgsSUFBSSxFQUFFO1FBRUosVUFBVSxFQUFFLEtBQUs7UUFFakIsYUFBYSxFQUFFLEtBQUs7UUFFcEIsVUFBVSxFQUFFO1lBQ1YsWUFBWSxFQUFFLENBQUM7U0FDaEI7UUFFRCxVQUFVLEVBQUUsVUFBVSxDQUFDLE1BQU07UUFDN0IsYUFBYSxFQUFFLENBQUM7UUFDaEIsUUFBUSxFQUFFLEtBQUs7S0FDaEI7SUFFRCxNQUFNLEVB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QTtZQUNKLENBQUM7WUFDRCxJQUFJLEVBQUU7Z0JBQ0osS0FBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNqQyxDQUFDO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELGVBQWUsRUFBZixVQUFnQixJQUFhO1FBQzNCLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDWCxhQUFhLEVBQUUsSUFBSTtTQUNwQixDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsVUFBVSxFQUFWLFVBQVcsS0FBYTtRQUN0QixFQUFFLENBQUMsU0FBUyxDQUFDO1lBQ1gsS0FBSyxPQUFBO1NBQ04sQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELGVBQWUsRUFBZixVQUFnQixLQUFhO1FBQzNCLEVBQUUsQ0FBQyxTQUFTLENBQUM7WUFDWCxLQUFLLE9BQUE7WUFDTCxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxVQUFVO1FBQ1IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxVQUFVLENBQUMsT0FBTyxDQUFDO0lBQ3JELENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vLi4vLi4vdXRpbHMvdXRpbCcpO1xuY29uc3QgQ2F2SW1hZ2UgPSByZXF1aXJlKCcuLy4uLy4uL2VudGl0aXkvQ2F2SW1hZ2VWMicpXG5cbi8vIOmAj+aYjuW6puaemuS4vlxuZW51bSBBbHBoYUVudW0ge1xuICBMb3cgPSAwLjgsXG4gIE1pZCA9IDAuNixcbiAgSGVpZ2h0ID0gMC4zLFxuICBBbGwgPSAxXG59XG5cbmVudW0gTGF5b3V0TW9kZSB7XG4gIE9sZFRvcCA9ICdvbGQtdG9wJyxcbiAgT2xkRG93biA9ICdvbGQtZG93bidcbn1cblxuLy8g6Led56a75bqV6YOo6Led56a7XG5sZXQgTWFyZ2luQm90dG9tID0gMDtcbi8vIOmAieS4reeahOWbvueJh3NyY1xubGV0IGNob29zZWRQaG90b1NyYzogc3RyaW5nID0gJyc7XG4vLyDpgInkuK3nmoTlm77niYdjYW52YXPlr7nosaFcbmxldCBjaG9vc2VkQ2F2SW1hZ2U6IGFueSA9IG51bGw7XG4vLyDkuLsgY2FudmFzXG5sZXQgbWFpbkNhbnZhczogYW55ID0gbnVsbDtcbi8vIOS4uyBjdHhcbmxldCBtYWluQ3R4OiBhbnkgPSBudWxsO1xuLy8g6YGu572p5bGCY3R4XG5sZXQgd3JhcHBlckN0eDogYW55ID0gbnVsbDtcbi8vIOW3pui+ueWwj+eQg+i3neemu+mhtumDqOi3neemu1xubGV0IGxlZnRCYWxsVG9wID0gMDtcblxuUGFnZSh7XG4gIC8qKlxuICAgKiDpobXpnaLnmoTliJ3lp4vmlbDmja5cbiAgICovXG4gIGRhdGE6IHtcbiAgICAvLyDmmK/lkKblsZXnpLrnm7jmnLpcbiAgICBzaG93Q2FtZXJhOiBmYWxzZSxcbiAgICAvLyDmmK/lkKbmmK/pga7nvanmqKHlvI9cbiAgICBpc1dyYXBwZXJNb2RlOiBmYWxzZSxcbiAgICAvLyDns7vnu5/kv6Hmga9cbiAgICBzeXN0ZW1JbmZvOiB7XG4gICAgICB3aW5kb3dIZWlnaHQ6IDAsXG4gICAgfSxcbiAgICAvLyDpobXpnaLluIPlsYBcbiAgICBsYXlvdXRNb2RlOiBMYXlvdXRNb2RlLk9sZFRvcCxcbiAgICBjb25maWdCYWxsVG9wOiAwLFxuICAgIGluaXREb25lOiBmYWxzZSxcbiAgfSxcblxuICBvbkxvYWQob3B0aW9uczogYW55KSB7XG4gICAgY2hvb3NlZFBob3RvU3JjID0gb3B0aW9ucy5waWNTcmM7XG5cbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgbGF5b3V0TW9kZTogb3B0aW9ucy5sYXlvdXRNb2RlIHx8IExheW91dE1vZGUuT2xkVG9wXG4gICAgfSk7XG5cblxuICAgIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgIHRpdGxlOiAn5Yqg6L296YWN572u5LitJ1xuICAgIH0pXG4gIH0sXG5cbiAgb25TaGFyZUFwcE1lc3NhZ2UoKSB7XG4gICAgcmV0dXJuIGdldEFwcCgpLmdsb2JhbERhdGEuc2hhcmVkT2JqXG4gIH0sXG5cbiAgb25TaGFyZVRpbWVsaW5lKCkge1xuICAgIHJldHVybiBnZXRBcHAoKS5nbG9iYWxEYXRhLnNoYXJlZE9ialxuICB9LFxuXG4gIGFzeW5jIG9uUmVhZHkoKSB7XG4gICAgdGhpcy5pbml0KCk7XG4gICAgaWYgKGNob29zZWRQaG90b1NyYykge1xuICAgICAgc2V0VGltZW91dChhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIOW8gOWni+WIneWni+WMllxuICAgICAgICBhd2FpdCB0aGlzLmluaXRBbGxDYW52YXMoKTtcbiAgICAgICAgLy8g5Yid5aeL5YyWY2F2SW1hZ2VcbiAgICAgICAgYXdhaXQgdGhpcy5pbml0Q2F2SW1hZ2UoKTtcbiAgICAgICAgLy8g56ys5LiA5qyh57uY5Yi2XG4gICAgICAgIGNob29zZWRDYXZJbWFnZS5zdGFydERyYXcodHJ1ZSk7XG5cbiAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICBzaG93Q2FtZXJhOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XG5cbiAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICBpbml0RG9uZTogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgfSwgMTAwMClcbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIHNob3dDYW1lcmE6IHRydWVcbiAgICAgIH0pXG4gICAgICB3eC5oaWRlTG9hZGluZygpO1xuICAgIH0sIDEwMDApXG4gIH0sXG5cbiAgaW5pdCgpIHtcbiAgICBjb25zdCBsYXlvdXRNb2RlID0gdGhpcy5kYXRhLmxheW91dE1vZGU7XG4gICAgbGV0IGNvbmZpZ0JhbGxUb3AgPSAwO1xuICAgIGNvbnN0IHdpbmRvd0hlaWdodCA9IHd4LmdldFN5c3RlbUluZm9TeW5jKCkud2luZG93SGVpZ2h0O1xuXG4gICAgdGhpcy5zZXREYXRhKHtcbiAgICAgIHN5c3RlbUluZm86IHd4LmdldFN5c3RlbUluZm9TeW5jKClcbiAgICB9KVxuICAgIGlmIChsYXlvdXRNb2RlID09PSBMYXlvdXRNb2RlLk9sZFRvcCkge1xuICAgICAgTWFyZ2luQm90dG9tID0gd2luZG93SGVpZ2h0IC0gMjc1O1xuXG4gICAgICBjb25maWdCYWxsVG9wID0gTWFyZ2luQm90dG9tIC0gMjA7XG4gICAgfSBlbHNlIGlmIChsYXlvdXRNb2RlID09PSBMYXlvdXRNb2RlLk9sZERvd24pIHtcbiAgICAgIE1hcmdpbkJvdHRvbSA9IDIwMDtcbiAgICAgIGNvbmZpZ0JhbGxUb3AgPSAxODA7XG5cbiAgICB9XG4gICAgdGhpcy5zZXREYXRhKHtcbiAgICAgIGNvbmZpZ0JhbGxUb3BcbiAgICB9KVxuICAgIGNob29zZWRDYXZJbWFnZSA9IG51bGw7XG4gICAgbWFpbkNhbnZhcyA9IG51bGw7XG4gICAgbWFpbkN0eCA9IG51bGw7XG4gICAgd3JhcHBlckN0eCA9IG51bGw7XG4gICAgbGVmdEJhbGxUb3AgPSBNYXJnaW5Cb3R0b207XG4gIH0sXG5cbiAgLy8g5Yid5aeL5YyW5omA5pyJ55qEY2FudmFzXG4gIGluaXRBbGxDYW52YXMoKSB7XG4gICAgY29uc3QgcXVlcnkgPSB0aGlzLmNyZWF0ZVNlbGVjdG9yUXVlcnkoKVxuICAgIGNvbnN0IGRwciA9IHd4LmdldFN5c3RlbUluZm9TeW5jKCkucGl4ZWxSYXRpb1xuXG4gICAgY29uc3QgbWFpbiA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgLy8g6I635Y+W5Li7Y2FudmFzXG4gICAgICBxdWVyeS5zZWxlY3QoJyNtYWluLWNhbnZhcycpXG4gICAgICAgIC5maWVsZHMoeyBub2RlOiB0cnVlLCBzaXplOiB0cnVlIH0pXG4gICAgICAgIC5leGVjKGFzeW5jIChyZXMpID0+IHtcbiAgICAgICAgICBjb25zdCBjYW52YXMgPSByZXNbMF0ubm9kZVxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IHJlc1swXS53aWR0aCAqIGRwclxuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSByZXNbMF0uaGVpZ2h0ICogZHByXG4gICAgICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgY3R4LnNjYWxlKGRwciwgZHByKVxuXG4gICAgICAgICAgbWFpbkNhbnZhcyA9IGNhbnZhcztcbiAgICAgICAgICBtYWluQ3R4ID0gY3R4O1xuXG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfSlcbiAgICB9KVxuXG4gICAgLy8g6I635Y+W6JKZ5bGCY2FudmFzXG4gICAgY29uc3Qgd3JhcHBlciA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgcXVlcnkuc2VsZWN0KCcjd3JhcHBlci1jYW52YXMnKVxuICAgICAgICAuZmllbGRzKHsgbm9kZTogdHJ1ZSwgc2l6ZTogdHJ1ZSB9KVxuICAgICAgICAuZXhlYyhhc3luYyAocmVzKSA9PiB7XG4gICAgICAgICAgY29uc3QgY2FudmFzID0gcmVzWzFdLm5vZGVcbiAgICAgICAgICBjYW52YXMud2lkdGggPSByZXNbMV0ud2lkdGggKiBkcHJcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gcmVzWzFdLmhlaWdodCAqIGRwclxuICAgICAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgIGN0eC5zY2FsZShkcHIsIGRwcilcblxuICAgICAgICAgIHdyYXBwZXJDdHggPSBjdHg7XG5cbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9KVxuICAgIH0pXG5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoW21haW4sIHdyYXBwZXJdKTtcbiAgfSxcblxuXG4gIGFzeW5jIGluaXRDYXZJbWFnZSgpIHtcbiAgICBjaG9vc2VkQ2F2SW1hZ2UgPSBuZXcgQ2F2SW1hZ2UoKTtcbiAgICBjaG9vc2VkQ2F2SW1hZ2UuY29uZmlnKHtcbiAgICAgIGNhbnZhczogbWFpbkNhbnZhcyxcbiAgICAgIGN0eDogbWFpbkN0eCxcbiAgICAgIGltYWdlOiBjaG9vc2VkUGhvdG9TcmMsXG4gICAgICBjbGlwQm90dG9tOiBNYXJnaW5Cb3R0b20sXG4gICAgICB3cmFwcGVyQ3R4LFxuICAgICAgYWxwaGFOdW06IEFscGhhRW51bS5NaWQsXG4gICAgICBsYXlvdXRNb2RlOiB0aGlzLmRhdGEubGF5b3V0TW9kZVxuICAgIH0pO1xuICAgIGF3YWl0IGNob29zZWRDYXZJbWFnZS5pbml0KCk7XG4gIH0sXG5cbiAgaGFuZGxlTWFpbkNhdlN0YXJ0KGU6IGFueSkge1xuICAgIGlmICghdGhpcy5kYXRhLmluaXREb25lKSByZXR1cm47XG4gICAgY29uc3QgdG91Y2hlZEZpbmdlck51bSA9IGUudG91Y2hlcy5sZW5ndGg7XG5cbiAgICBpZiAodG91Y2hlZEZpbmdlck51bSA9PSAxKSB7XG4gICAgICAvLyDkuIDmoLnmiYvmjIfvvIznp7vliqhcbiAgICAgIGNob29zZWRDYXZJbWFnZS5tb3ZlU3RhcnQoZSk7XG4gICAgfSBlbHNlIGlmICh0b3VjaGVkRmluZ2VyTnVtID09PSAyKSB7XG4gICAgICAvLyDkuKTmoLnmiYvmjIfvvIznvKnmlL5cbiAgICAgIGNob29zZWRDYXZJbWFnZS56b29tU3RhcnQoZSk7XG4gICAgfVxuICB9LFxuXG4gIGhhbmRsZU1haW5DYXZNb3ZlKGU6IGFueSkge1xuICAgIGlmICghdGhpcy5kYXRhLmluaXREb25lKSByZXR1cm47XG4gICAgY29uc3QgdG91Y2hlZEZpbmdlck51bSA9IGUudG91Y2hlcy5sZW5ndGg7XG5cbiAgICBpZiAodG91Y2hlZEZpbmdlck51bSA9PSAxKSB7XG4gICAgICAvLyDkuIDmoLnmiYvmjIfvvIznp7vliqhcbiAgICAgIGNob29zZWRDYXZJbWFnZS5tb3ZlKGUpO1xuICAgIH0gZWxzZSBpZiAodG91Y2hlZEZpbmdlck51bSA9PT0gMikge1xuICAgICAgLy8g5Lik5qC55omL5oyH77yM57yp5pS+XG4gICAgICBjaG9vc2VkQ2F2SW1hZ2Uuem9vbU1vdmUoZSk7XG4gICAgfVxuICB9LFxuXG4gIGhhbmRsZU1haW5DYXZFbmQoKSB7XG4gICAgaWYgKCF0aGlzLmRhdGEuaW5pdERvbmUpIHJldHVybjtcblxuICAgIGNob29zZWRDYXZJbWFnZS50b3VjaEVuZCgpO1xuICB9LFxuXG4gIGhhbmRsZUxlZnRCYWxsTW92ZShlOiBhbnkpIHtcbiAgICBpZiAoIXRoaXMuZGF0YS5pbml0RG9uZSkgcmV0dXJuO1xuXG4gICAgbGVmdEJhbGxUb3AgPSBlLnk7XG4gICAgY2hvb3NlZENhdkltYWdlLmRyYXdDb3ZlcihlLnksIHVuZGVmaW5lZCk7XG4gICAgdGhpcy5fc2V0V3JhcHBlck1vZGUodHJ1ZSk7XG4gIH0sXG5cbiAgaGFuZGxlTGVmdEJhbGxNb3ZlRW5kKCkge1xuICAgIGNob29zZWRDYXZJbWFnZS5zdGFydERyYXcodHJ1ZSk7XG4gICAgdGhpcy5fc2V0V3JhcHBlck1vZGUoZmFsc2UpO1xuICB9LFxuXG4gIGhhbmRsZVJpZ2h0QmFsbE1vdmUoZTogYW55KSB7XG4gICAgaWYgKCF0aGlzLmRhdGEuaW5pdERvbmUpIHJldHVybjtcblxuICAgIGNob29zZWRDYXZJbWFnZS5kcmF3Q292ZXIobGVmdEJhbGxUb3AsIGUueSk7XG4gICAgdGhpcy5fc2V0V3JhcHBlck1vZGUodHJ1ZSk7XG4gIH0sXG5cbiAgaGFuZGxlUmlnaHRCYWxsTW92ZUVuZCgpIHtcbiAgICBjaG9vc2VkQ2F2SW1hZ2Uuc3RhcnREcmF3KHRydWUpO1xuICAgIHRoaXMuX3NldFdyYXBwZXJNb2RlKGZhbHNlKTtcbiAgfSxcblxuICBoYW5kbGVBbHBoYUJ1dHRvbkNsaWNrKCkge1xuICAgIGlmICghdGhpcy5kYXRhLmluaXREb25lKSByZXR1cm47XG5cbiAgICBsZXQgYWxwaGFOdW0gPSBjaG9vc2VkQ2F2SW1hZ2UuZ2xvYmFsQWxwaGE7XG4gICAgY29uc29sZS5sb2coJ2FscGhhTnVtOjo6JywgYWxwaGFOdW0pO1xuXG4gICAgaWYgKGFscGhhTnVtID09PSBBbHBoYUVudW0uTWlkKSB7XG4gICAgICBhbHBoYU51bSA9IEFscGhhRW51bS5IZWlnaHQ7XG4gICAgICB0aGlzLl9zaG93VG9hc3QoJ+mAj+aYjuW6pumrmCcpO1xuICAgIH0gZWxzZSBpZiAoYWxwaGFOdW0gPT09IEFscGhhRW51bS5IZWlnaHQpIHtcbiAgICAgIGFscGhhTnVtID0gQWxwaGFFbnVtLkxvdztcbiAgICAgIHRoaXMuX3Nob3dUb2FzdCgn6YCP5piO5bqm5L2OJyk7XG4gICAgfSBlbHNlIGlmIChhbHBoYU51bSA9PT0gQWxwaGFFbnVtLkxvdykge1xuICAgICAgYWxwaGFOdW0gPSBBbHBoYUVudW0uTWlkO1xuICAgICAgdGhpcy5fc2hvd1RvYXN0KCfpgI/mmI7luqbkuK3nrYknKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWxwaGFOdW0gPSBBbHBoYUVudW0uTWlkO1xuICAgICAgdGhpcy5fc2hvd1RvYXN0KCfpgI/mmI7luqbkuK3nrYknKTtcbiAgICB9XG5cbiAgICBjaG9vc2VkQ2F2SW1hZ2Uuc2V0R2xvYmFsQWxwaGEoYWxwaGFOdW0pO1xuICB9LFxuXG4gIGhhbmRsZVJvdGF0ZUNsaWNrKCkge1xuICAgIGlmICghdGhpcy5kYXRhLmluaXREb25lKSByZXR1cm47XG5cbiAgICBsZXQgcm90YXRlTnVtID0gY2hvb3NlZENhdkltYWdlLnJvdGF0ZU51bTtcblxuICAgIHJvdGF0ZU51bSArPSA5MDtcbiAgICBpZiAocm90YXRlTnVtID49IDM2MCkge1xuICAgICAgcm90YXRlTnVtID0gMDtcbiAgICB9XG5cbiAgICB0aGlzLl9zaG93VG9hc3QoJ+aXi+i9rDkw5bqmJyk7XG4gICAgY2hvb3NlZENhdkltYWdlLnNldFJvdGF0ZShyb3RhdGVOdW0pO1xuICB9LFxuXG4gIGhhbmRsZVRha2VQaG90bygpIHtcbiAgICBpZiAoIXRoaXMuZGF0YS5pbml0RG9uZSkgcmV0dXJuO1xuXG4gICAgY29uc3QgY2FtZXJhID0gd3guY3JlYXRlQ2FtZXJhQ29udGV4dCgpXG4gICAgY2FtZXJhLnRha2VQaG90byh7XG4gICAgICBxdWFsaXR5OiAnaGlnaCcsXG4gICAgICBzdWNjZXNzOiAocmVzOiBhbnkpID0+IHtcblxuICAgICAgICBjb25zdCB0YWtlUGhvdG9TcmMgPSByZXMudGVtcEltYWdlUGF0aDtcbiAgICAgICAgLy8g6K6+572u5Zu+54mH5Li65LiN6YCP5piOXG4gICAgICAgIGNob29zZWRDYXZJbWFnZS5zZXRHbG9iYWxBbHBoYShBbHBoYUVudW0uQWxsKTtcblxuICAgICAgICB3eC5jYW52YXNUb1RlbXBGaWxlUGF0aCh7XG4gICAgICAgICAgY2FudmFzOiBtYWluQ2FudmFzLFxuICAgICAgICAgIGZpbGVUeXBlOiAncG5nJyxcbiAgICAgICAgICBxdWFsaXR5OiAxLCAvL+WbvueJh+i0qOmHj1xuICAgICAgICAgIHN1Y2Nlc3M6IChyZXMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhbnZhc1Bob3RvU3JjID0gcmVzLnRlbXBGaWxlUGF0aDtcblxuICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgICAgICAgIHVybDogYC9wYWdlcy9jb25maWctcGhvdG8tcGFnZS9jb25maWctcGhvdG8tcGFnZT90YWtlUGhvdG9TcmM9JHt0YWtlUGhvdG9TcmN9JmNhbnZhc1Bob3RvU3JjPSR7Y2FudmFzUGhvdG9TcmN9YCxcbiAgICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgICAgaGFuZGxlQmFjazogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgY2hvb3NlZENhdkltYWdlLnNldEdsb2JhbEFscGhhKEFscGhhRW51bS5NaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZhaWw6ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3Nob3dFcnJvclRvYXN0KCfml6flm77lpITnkIblpLHotKUnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgICAgZmFpbDogKCkgPT4ge1xuICAgICAgICB0aGlzLl9zaG93RXJyb3JUb2FzdCgn54Wn54mH5ouN5pGE5aSx6LSlJyk7XG4gICAgICB9XG4gICAgfSlcbiAgfSxcblxuICBfc2V0V3JhcHBlck1vZGUoYm9vbDogYm9vbGVhbikge1xuICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICBpc1dyYXBwZXJNb2RlOiBib29sLFxuICAgIH0pXG4gIH0sXG5cbiAgX3Nob3dUb2FzdCh0aXRsZTogc3RyaW5nKSB7XG4gICAgd3guc2hvd1RvYXN0KHtcbiAgICAgIHRpdGxlXG4gICAgfSlcbiAgfSxcbiAgX3Nob3dFcnJvclRvYXN0KHRpdGxlOiBzdHJpbmcpIHtcbiAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgdGl0bGUsXG4gICAgICBpY29uOiAnZXJyb3InXG4gICAgfSlcbiAgfSxcbiAgX2lzT2xkRG9udygpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhLmxheW91dE1vZGUgPT09IExheW91dE1vZGUuT2xkRG93bjtcbiAgfVxufSkiXX0=