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
var isJumping = false;
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
    handleBackButtonClick: function () {
        wx.showModal({
            title: '提示',
            content: '确定取消拍摄吗?',
            success: function (res) {
                if (res.confirm) {
                    wx.navigateBack();
                }
            }
        });
    },
    handleResetButtonClick: function () {
        wx.showToast({
            title: '定位到中心',
        });
        choosedCavImage.resetToCenter();
    },
    handleTakePhoto: function () {
        var _this = this;
        if (!this.data.initDone)
            return;
        if (isJumping) {
            wx.showToast({
                title: '不要频繁点击',
                icon: 'error'
            });
            return;
        }
        ;
        isJumping = true;
        wx.showLoading({
            title: '处理中'
        });
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
                        isJumping = false;
                        wx.hideLoading();
                    },
                    fail: function () {
                        isJumping = false;
                        _this._showErrorToast('旧图处理失败');
                    }
                });
            },
            fail: function () {
                isJumping = false;
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
        wx.hideLoading();
    },
    _isOldDonw: function () {
        return this.data.layoutMode === LayoutMode.OldDown;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhvdG8tY2FudmFzLXBhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwaG90by1jYW52YXMtcGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDNUMsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUE7QUFHdEQsSUFBSyxTQUtKO0FBTEQsV0FBSyxTQUFTO0lBQ1oseUNBQVMsQ0FBQTtJQUNULHlDQUFTLENBQUE7SUFDVCwrQ0FBWSxDQUFBO0lBQ1osdUNBQU8sQ0FBQTtBQUNULENBQUMsRUFMSSxTQUFTLEtBQVQsU0FBUyxRQUtiO0FBRUQsSUFBSyxVQUdKO0FBSEQsV0FBSyxVQUFVO0lBQ2IsZ0NBQWtCLENBQUE7SUFDbEIsa0NBQW9CLENBQUE7QUFDdEIsQ0FBQyxFQUhJLFVBQVUsS0FBVixVQUFVLFFBR2Q7QUFHRCxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFFckIsSUFBSSxlQUFlLEdBQVcsRUFBRSxDQUFDO0FBRWpDLElBQUksZUFBZSxHQUFRLElBQUksQ0FBQztBQUVoQyxJQUFJLFVBQVUsR0FBUSxJQUFJLENBQUM7QUFFM0IsSUFBSSxPQUFPLEdBQVEsSUFBSSxDQUFDO0FBRXhCLElBQUksVUFBVSxHQUFRLElBQUksQ0FBQztBQUUzQixJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFFcEIsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBRXRCLElBQUksQ0FBQztJQUlILElBQUksRUFBRTtRQUVKLFVBQVUsRUFBRSxLQUFLO1FBRWpCLGFBQWEsRUFBRSxLQUFLO1FBRXBCLFVBQVUsRUFBRTtZQUNWLFlBQVksRUFBRSxDQUFDO1NBQ2hCO1FBRUQsVUFBVSxFQUFFLFVBQVUsQ0FBQyxNQUFNO1FBQzdCLGFBQWEsRUFBRSxDQUFDO1FBQ2hCLFFB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LENBQUE7SUFDSixDQUFDO0lBQ0QsZUFBZSxFQUFmLFVBQWdCLEtBQWE7UUFDM0IsRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUNYLEtBQUssT0FBQTtZQUNMLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFDRCxVQUFVO1FBQ1IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxVQUFVLENBQUMsT0FBTyxDQUFDO0lBQ3JELENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB1dGlscyA9IHJlcXVpcmUoJy4vLi4vLi4vdXRpbHMvdXRpbCcpO1xuY29uc3QgQ2F2SW1hZ2UgPSByZXF1aXJlKCcuLy4uLy4uL2VudGl0aXkvQ2F2SW1hZ2VWMicpXG5cbi8vIOmAj+aYjuW6puaemuS4vlxuZW51bSBBbHBoYUVudW0ge1xuICBMb3cgPSAwLjgsXG4gIE1pZCA9IDAuNixcbiAgSGVpZ2h0ID0gMC4zLFxuICBBbGwgPSAxXG59XG5cbmVudW0gTGF5b3V0TW9kZSB7XG4gIE9sZFRvcCA9ICdvbGQtdG9wJyxcbiAgT2xkRG93biA9ICdvbGQtZG93bidcbn1cblxuLy8g6Led56a75bqV6YOo6Led56a7XG5sZXQgTWFyZ2luQm90dG9tID0gMDtcbi8vIOmAieS4reeahOWbvueJh3NyY1xubGV0IGNob29zZWRQaG90b1NyYzogc3RyaW5nID0gJyc7XG4vLyDpgInkuK3nmoTlm77niYdjYW52YXPlr7nosaFcbmxldCBjaG9vc2VkQ2F2SW1hZ2U6IGFueSA9IG51bGw7XG4vLyDkuLsgY2FudmFzXG5sZXQgbWFpbkNhbnZhczogYW55ID0gbnVsbDtcbi8vIOS4uyBjdHhcbmxldCBtYWluQ3R4OiBhbnkgPSBudWxsO1xuLy8g6YGu572p5bGCY3R4XG5sZXQgd3JhcHBlckN0eDogYW55ID0gbnVsbDtcbi8vIOW3pui+ueWwj+eQg+i3neemu+mhtumDqOi3neemu1xubGV0IGxlZnRCYWxsVG9wID0gMDtcbi8vIOaYr+WQpuato+WcqOi3s+i9rFxubGV0IGlzSnVtcGluZyA9IGZhbHNlO1xuXG5QYWdlKHtcbiAgLyoqXG4gICAqIOmhtemdoueahOWIneWni+aVsOaNrlxuICAgKi9cbiAgZGF0YToge1xuICAgIC8vIOaYr+WQpuWxleekuuebuOaculxuICAgIHNob3dDYW1lcmE6IGZhbHNlLFxuICAgIC8vIOaYr+WQpuaYr+mBrue9qeaooeW8j1xuICAgIGlzV3JhcHBlck1vZGU6IGZhbHNlLFxuICAgIC8vIOezu+e7n+S/oeaBr1xuICAgIHN5c3RlbUluZm86IHtcbiAgICAgIHdpbmRvd0hlaWdodDogMCxcbiAgICB9LFxuICAgIC8vIOmhtemdouW4g+WxgFxuICAgIGxheW91dE1vZGU6IExheW91dE1vZGUuT2xkVG9wLFxuICAgIGNvbmZpZ0JhbGxUb3A6IDAsXG4gICAgaW5pdERvbmU6IGZhbHNlLFxuICB9LFxuXG4gIG9uTG9hZChvcHRpb25zOiBhbnkpIHtcbiAgICBjaG9vc2VkUGhvdG9TcmMgPSBvcHRpb25zLnBpY1NyYztcblxuICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICBsYXlvdXRNb2RlOiBvcHRpb25zLmxheW91dE1vZGUgfHwgTGF5b3V0TW9kZS5PbGRUb3BcbiAgICB9KTtcblxuXG4gICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgdGl0bGU6ICfliqDovb3phY3nva7kuK0nXG4gICAgfSlcbiAgfSxcblxuICBvblNoYXJlQXBwTWVzc2FnZSgpIHtcbiAgICByZXR1cm4gZ2V0QXBwKCkuZ2xvYmFsRGF0YS5zaGFyZWRPYmpcbiAgfSxcblxuICBvblNoYXJlVGltZWxpbmUoKSB7XG4gICAgcmV0dXJuIGdldEFwcCgpLmdsb2JhbERhdGEuc2hhcmVkT2JqXG4gIH0sXG5cbiAgYXN5bmMgb25SZWFkeSgpIHtcbiAgICB0aGlzLmluaXQoKTtcbiAgICBpZiAoY2hvb3NlZFBob3RvU3JjKSB7XG4gICAgICBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8g5byA5aeL5Yid5aeL5YyWXG4gICAgICAgIGF3YWl0IHRoaXMuaW5pdEFsbENhbnZhcygpO1xuICAgICAgICAvLyDliJ3lp4vljJZjYXZJbWFnZVxuICAgICAgICBhd2FpdCB0aGlzLmluaXRDYXZJbWFnZSgpO1xuICAgICAgICAvLyDnrKzkuIDmrKHnu5jliLZcbiAgICAgICAgY2hvb3NlZENhdkltYWdlLnN0YXJ0RHJhdyh0cnVlKTtcblxuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIHNob3dDYW1lcmE6IHRydWVcbiAgICAgICAgfSlcbiAgICAgICAgd3guaGlkZUxvYWRpbmcoKTtcblxuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIGluaXREb25lOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICB9LCAxMDAwKVxuICAgIH1cblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgc2hvd0NhbWVyYTogdHJ1ZVxuICAgICAgfSlcbiAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XG4gICAgfSwgMTAwMClcbiAgfSxcblxuICBpbml0KCkge1xuICAgIGNvbnN0IGxheW91dE1vZGUgPSB0aGlzLmRhdGEubGF5b3V0TW9kZTtcbiAgICBsZXQgY29uZmlnQmFsbFRvcCA9IDA7XG4gICAgY29uc3Qgd2luZG93SGVpZ2h0ID0gd3guZ2V0U3lzdGVtSW5mb1N5bmMoKS53aW5kb3dIZWlnaHQ7XG5cbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgc3lzdGVtSW5mbzogd3guZ2V0U3lzdGVtSW5mb1N5bmMoKVxuICAgIH0pXG4gICAgaWYgKGxheW91dE1vZGUgPT09IExheW91dE1vZGUuT2xkVG9wKSB7XG4gICAgICBNYXJnaW5Cb3R0b20gPSB3aW5kb3dIZWlnaHQgLSAyNzU7XG5cbiAgICAgIGNvbmZpZ0JhbGxUb3AgPSBNYXJnaW5Cb3R0b20gLSAyMDtcbiAgICB9IGVsc2UgaWYgKGxheW91dE1vZGUgPT09IExheW91dE1vZGUuT2xkRG93bikge1xuICAgICAgTWFyZ2luQm90dG9tID0gMjAwO1xuICAgICAgY29uZmlnQmFsbFRvcCA9IDE4MDtcblxuICAgIH1cbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgY29uZmlnQmFsbFRvcFxuICAgIH0pXG4gICAgY2hvb3NlZENhdkltYWdlID0gbnVsbDtcbiAgICBtYWluQ2FudmFzID0gbnVsbDtcbiAgICBtYWluQ3R4ID0gbnVsbDtcbiAgICB3cmFwcGVyQ3R4ID0gbnVsbDtcbiAgICBsZWZ0QmFsbFRvcCA9IE1hcmdpbkJvdHRvbTtcbiAgfSxcblxuICAvLyDliJ3lp4vljJbmiYDmnInnmoRjYW52YXNcbiAgaW5pdEFsbENhbnZhcygpIHtcbiAgICBjb25zdCBxdWVyeSA9IHRoaXMuY3JlYXRlU2VsZWN0b3JRdWVyeSgpXG4gICAgY29uc3QgZHByID0gd3guZ2V0U3lzdGVtSW5mb1N5bmMoKS5waXhlbFJhdGlvXG5cbiAgICBjb25zdCBtYWluID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAvLyDojrflj5bkuLtjYW52YXNcbiAgICAgIHF1ZXJ5LnNlbGVjdCgnI21haW4tY2FudmFzJylcbiAgICAgICAgLmZpZWxkcyh7IG5vZGU6IHRydWUsIHNpemU6IHRydWUgfSlcbiAgICAgICAgLmV4ZWMoYXN5bmMgKHJlcykgPT4ge1xuICAgICAgICAgIGNvbnN0IGNhbnZhcyA9IHJlc1swXS5ub2RlXG4gICAgICAgICAgY2FudmFzLndpZHRoID0gcmVzWzBdLndpZHRoICogZHByXG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHJlc1swXS5oZWlnaHQgKiBkcHJcbiAgICAgICAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgICBjdHguc2NhbGUoZHByLCBkcHIpXG5cbiAgICAgICAgICBtYWluQ2FudmFzID0gY2FudmFzO1xuICAgICAgICAgIG1haW5DdHggPSBjdHg7XG5cbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9KVxuICAgIH0pXG5cbiAgICAvLyDojrflj5bokpnlsYJjYW52YXNcbiAgICBjb25zdCB3cmFwcGVyID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBxdWVyeS5zZWxlY3QoJyN3cmFwcGVyLWNhbnZhcycpXG4gICAgICAgIC5maWVsZHMoeyBub2RlOiB0cnVlLCBzaXplOiB0cnVlIH0pXG4gICAgICAgIC5leGVjKGFzeW5jIChyZXMpID0+IHtcbiAgICAgICAgICBjb25zdCBjYW52YXMgPSByZXNbMV0ubm9kZVxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IHJlc1sxXS53aWR0aCAqIGRwclxuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSByZXNbMV0uaGVpZ2h0ICogZHByXG4gICAgICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgY3R4LnNjYWxlKGRwciwgZHByKVxuXG4gICAgICAgICAgd3JhcHBlckN0eCA9IGN0eDtcblxuICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH0pXG4gICAgfSlcblxuICAgIHJldHVybiBQcm9taXNlLmFsbChbbWFpbiwgd3JhcHBlcl0pO1xuICB9LFxuXG5cbiAgYXN5bmMgaW5pdENhdkltYWdlKCkge1xuICAgIGNob29zZWRDYXZJbWFnZSA9IG5ldyBDYXZJbWFnZSgpO1xuICAgIGNob29zZWRDYXZJbWFnZS5jb25maWcoe1xuICAgICAgY2FudmFzOiBtYWluQ2FudmFzLFxuICAgICAgY3R4OiBtYWluQ3R4LFxuICAgICAgaW1hZ2U6IGNob29zZWRQaG90b1NyYyxcbiAgICAgIGNsaXBCb3R0b206IE1hcmdpbkJvdHRvbSxcbiAgICAgIHdyYXBwZXJDdHgsXG4gICAgICBhbHBoYU51bTogQWxwaGFFbnVtLk1pZCxcbiAgICAgIGxheW91dE1vZGU6IHRoaXMuZGF0YS5sYXlvdXRNb2RlXG4gICAgfSk7XG4gICAgYXdhaXQgY2hvb3NlZENhdkltYWdlLmluaXQoKTtcbiAgfSxcblxuICBoYW5kbGVNYWluQ2F2U3RhcnQoZTogYW55KSB7XG4gICAgaWYgKCF0aGlzLmRhdGEuaW5pdERvbmUpIHJldHVybjtcbiAgICBjb25zdCB0b3VjaGVkRmluZ2VyTnVtID0gZS50b3VjaGVzLmxlbmd0aDtcblxuICAgIGlmICh0b3VjaGVkRmluZ2VyTnVtID09IDEpIHtcbiAgICAgIC8vIOS4gOagueaJi+aMh++8jOenu+WKqFxuICAgICAgY2hvb3NlZENhdkltYWdlLm1vdmVTdGFydChlKTtcbiAgICB9IGVsc2UgaWYgKHRvdWNoZWRGaW5nZXJOdW0gPT09IDIpIHtcbiAgICAgIC8vIOS4pOagueaJi+aMh++8jOe8qeaUvlxuICAgICAgY2hvb3NlZENhdkltYWdlLnpvb21TdGFydChlKTtcbiAgICB9XG4gIH0sXG5cbiAgaGFuZGxlTWFpbkNhdk1vdmUoZTogYW55KSB7XG4gICAgaWYgKCF0aGlzLmRhdGEuaW5pdERvbmUpIHJldHVybjtcbiAgICBjb25zdCB0b3VjaGVkRmluZ2VyTnVtID0gZS50b3VjaGVzLmxlbmd0aDtcblxuICAgIGlmICh0b3VjaGVkRmluZ2VyTnVtID09IDEpIHtcbiAgICAgIC8vIOS4gOagueaJi+aMh++8jOenu+WKqFxuICAgICAgY2hvb3NlZENhdkltYWdlLm1vdmUoZSk7XG4gICAgfSBlbHNlIGlmICh0b3VjaGVkRmluZ2VyTnVtID09PSAyKSB7XG4gICAgICAvLyDkuKTmoLnmiYvmjIfvvIznvKnmlL5cbiAgICAgIGNob29zZWRDYXZJbWFnZS56b29tTW92ZShlKTtcbiAgICB9XG4gIH0sXG5cbiAgaGFuZGxlTWFpbkNhdkVuZCgpIHtcbiAgICBpZiAoIXRoaXMuZGF0YS5pbml0RG9uZSkgcmV0dXJuO1xuXG4gICAgY2hvb3NlZENhdkltYWdlLnRvdWNoRW5kKCk7XG4gIH0sXG5cbiAgaGFuZGxlTGVmdEJhbGxNb3ZlKGU6IGFueSkge1xuICAgIGlmICghdGhpcy5kYXRhLmluaXREb25lKSByZXR1cm47XG5cbiAgICBsZWZ0QmFsbFRvcCA9IGUueTtcbiAgICBjaG9vc2VkQ2F2SW1hZ2UuZHJhd0NvdmVyKGUueSwgdW5kZWZpbmVkKTtcbiAgICB0aGlzLl9zZXRXcmFwcGVyTW9kZSh0cnVlKTtcbiAgfSxcblxuICBoYW5kbGVMZWZ0QmFsbE1vdmVFbmQoKSB7XG4gICAgY2hvb3NlZENhdkltYWdlLnN0YXJ0RHJhdyh0cnVlKTtcbiAgICB0aGlzLl9zZXRXcmFwcGVyTW9kZShmYWxzZSk7XG4gIH0sXG5cbiAgaGFuZGxlUmlnaHRCYWxsTW92ZShlOiBhbnkpIHtcbiAgICBpZiAoIXRoaXMuZGF0YS5pbml0RG9uZSkgcmV0dXJuO1xuXG4gICAgY2hvb3NlZENhdkltYWdlLmRyYXdDb3ZlcihsZWZ0QmFsbFRvcCwgZS55KTtcbiAgICB0aGlzLl9zZXRXcmFwcGVyTW9kZSh0cnVlKTtcbiAgfSxcblxuICBoYW5kbGVSaWdodEJhbGxNb3ZlRW5kKCkge1xuICAgIGNob29zZWRDYXZJbWFnZS5zdGFydERyYXcodHJ1ZSk7XG4gICAgdGhpcy5fc2V0V3JhcHBlck1vZGUoZmFsc2UpO1xuICB9LFxuXG4gIGhhbmRsZUFscGhhQnV0dG9uQ2xpY2soKSB7XG4gICAgaWYgKCF0aGlzLmRhdGEuaW5pdERvbmUpIHJldHVybjtcblxuICAgIGxldCBhbHBoYU51bSA9IGNob29zZWRDYXZJbWFnZS5nbG9iYWxBbHBoYTtcblxuICAgIGlmIChhbHBoYU51bSA9PT0gQWxwaGFFbnVtLk1pZCkge1xuICAgICAgYWxwaGFOdW0gPSBBbHBoYUVudW0uSGVpZ2h0O1xuICAgICAgdGhpcy5fc2hvd1RvYXN0KCfpgI/mmI7luqbpq5gnKTtcbiAgICB9IGVsc2UgaWYgKGFscGhhTnVtID09PSBBbHBoYUVudW0uSGVpZ2h0KSB7XG4gICAgICBhbHBoYU51bSA9IEFscGhhRW51bS5Mb3c7XG4gICAgICB0aGlzLl9zaG93VG9hc3QoJ+mAj+aYjuW6puS9jicpO1xuICAgIH0gZWxzZSBpZiAoYWxwaGFOdW0gPT09IEFscGhhRW51bS5Mb3cpIHtcbiAgICAgIGFscGhhTnVtID0gQWxwaGFFbnVtLk1pZDtcbiAgICAgIHRoaXMuX3Nob3dUb2FzdCgn6YCP5piO5bqm5Lit562JJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFscGhhTnVtID0gQWxwaGFFbnVtLk1pZDtcbiAgICAgIHRoaXMuX3Nob3dUb2FzdCgn6YCP5piO5bqm5Lit562JJyk7XG4gICAgfVxuXG4gICAgY2hvb3NlZENhdkltYWdlLnNldEdsb2JhbEFscGhhKGFscGhhTnVtKTtcbiAgfSxcblxuICBoYW5kbGVSb3RhdGVDbGljaygpIHtcbiAgICBpZiAoIXRoaXMuZGF0YS5pbml0RG9uZSkgcmV0dXJuO1xuXG4gICAgbGV0IHJvdGF0ZU51bSA9IGNob29zZWRDYXZJbWFnZS5yb3RhdGVOdW07XG5cbiAgICByb3RhdGVOdW0gKz0gOTA7XG4gICAgaWYgKHJvdGF0ZU51bSA+PSAzNjApIHtcbiAgICAgIHJvdGF0ZU51bSA9IDA7XG4gICAgfVxuXG4gICAgdGhpcy5fc2hvd1RvYXN0KCfml4vovaw5MOW6picpO1xuICAgIGNob29zZWRDYXZJbWFnZS5zZXRSb3RhdGUocm90YXRlTnVtKTtcbiAgfSxcblxuICBoYW5kbGVCYWNrQnV0dG9uQ2xpY2soKSB7XG4gICAgd3guc2hvd01vZGFsKHtcbiAgICAgIHRpdGxlOiAn5o+Q56S6JyxcbiAgICAgIGNvbnRlbnQ6ICfnoa7lrprlj5bmtojmi43mkYTlkJc/JyxcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgIGlmIChyZXMuY29uZmlybSkge1xuICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjaygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfSxcblxuICBoYW5kbGVSZXNldEJ1dHRvbkNsaWNrKCkge1xuICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICB0aXRsZTogJ+WumuS9jeWIsOS4reW/gycsXG4gICAgfSk7XG4gICAgY2hvb3NlZENhdkltYWdlLnJlc2V0VG9DZW50ZXIoKTtcbiAgfSxcblxuICBoYW5kbGVUYWtlUGhvdG8oKSB7XG4gICAgaWYgKCF0aGlzLmRhdGEuaW5pdERvbmUpIHJldHVybjtcbiAgICBpZiAoaXNKdW1waW5nKSB7XG4gICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICB0aXRsZTogJ+S4jeimgemikee5geeCueWHuycsXG4gICAgICAgIGljb246ICdlcnJvcidcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH07XG5cbiAgICBpc0p1bXBpbmcgPSB0cnVlO1xuXG4gICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgdGl0bGU6ICflpITnkIbkuK0nXG4gICAgfSk7XG5cbiAgICBjb25zdCBjYW1lcmEgPSB3eC5jcmVhdGVDYW1lcmFDb250ZXh0KClcbiAgICBjYW1lcmEudGFrZVBob3RvKHtcbiAgICAgIHF1YWxpdHk6ICdoaWdoJyxcbiAgICAgIHN1Y2Nlc3M6IChyZXM6IGFueSkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHRha2VQaG90b1NyYyA9IHJlcy50ZW1wSW1hZ2VQYXRoO1xuICAgICAgICAvLyDorr7nva7lm77niYfkuLrkuI3pgI/mmI5cbiAgICAgICAgY2hvb3NlZENhdkltYWdlLnNldEdsb2JhbEFscGhhKEFscGhhRW51bS5BbGwpO1xuXG4gICAgICAgIHd4LmNhbnZhc1RvVGVtcEZpbGVQYXRoKHtcbiAgICAgICAgICBjYW52YXM6IG1haW5DYW52YXMsXG4gICAgICAgICAgZmlsZVR5cGU6ICdwbmcnLFxuICAgICAgICAgIHF1YWxpdHk6IDEsIC8v5Zu+54mH6LSo6YePXG4gICAgICAgICAgc3VjY2VzczogKHJlcykgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2FudmFzUGhvdG9TcmMgPSByZXMudGVtcEZpbGVQYXRoO1xuXG4gICAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgICAgICAgdXJsOiBgL3BhZ2VzL2NvbmZpZy1waG90by1wYWdlL2NvbmZpZy1waG90by1wYWdlP3Rha2VQaG90b1NyYz0ke3Rha2VQaG90b1NyY30mY2FudmFzUGhvdG9TcmM9JHtjYW52YXNQaG90b1NyY31gLFxuICAgICAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICAgICBoYW5kbGVCYWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBjaG9vc2VkQ2F2SW1hZ2Uuc2V0R2xvYmFsQWxwaGEoQWxwaGFFbnVtLk1pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBpc0p1bXBpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmYWlsOiAoKSA9PiB7XG4gICAgICAgICAgICBpc0p1bXBpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX3Nob3dFcnJvclRvYXN0KCfml6flm77lpITnkIblpLHotKUnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgICAgZmFpbDogKCkgPT4ge1xuICAgICAgICBpc0p1bXBpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc2hvd0Vycm9yVG9hc3QoJ+eFp+eJh+aLjeaRhOWksei0pScpO1xuICAgICAgfVxuICAgIH0pXG4gIH0sXG5cbiAgX3NldFdyYXBwZXJNb2RlKGJvb2w6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgaXNXcmFwcGVyTW9kZTogYm9vbCxcbiAgICB9KVxuICB9LFxuXG4gIF9zaG93VG9hc3QodGl0bGU6IHN0cmluZykge1xuICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICB0aXRsZVxuICAgIH0pXG4gIH0sXG4gIF9zaG93RXJyb3JUb2FzdCh0aXRsZTogc3RyaW5nKSB7XG4gICAgd3guc2hvd1RvYXN0KHtcbiAgICAgIHRpdGxlLFxuICAgICAgaWNvbjogJ2Vycm9yJ1xuICAgIH0pXG5cbiAgICB3eC5oaWRlTG9hZGluZygpO1xuICB9LFxuICBfaXNPbGREb253KCkge1xuICAgIHJldHVybiB0aGlzLmRhdGEubGF5b3V0TW9kZSA9PT0gTGF5b3V0TW9kZS5PbGREb3duO1xuICB9XG59KSJdfQ==