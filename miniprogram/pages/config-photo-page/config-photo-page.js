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
var canvasPhotoSrc;
var canvasPhotoObj;
var takePhotoSrc;
var takePhotoObj;
var canvasPhotoChangeObj;
var configCanvas;
var configCtx;
var savedFilePath = '';
var ColorEnum;
(function (ColorEnum) {
    ColorEnum["None"] = "none";
    ColorEnum["Gray"] = "gray";
    ColorEnum["Black"] = "black";
    ColorEnum["Red"] = "red";
    ColorEnum["Green"] = "green";
    ColorEnum["Blue"] = "blue";
    ColorEnum["Yellow"] = "yellow";
    ColorEnum["Obverse"] = "obverse";
})(ColorEnum || (ColorEnum = {}));
var SaveMode;
(function (SaveMode) {
    SaveMode["NewPic"] = "new-pic";
    SaveMode["Both"] = "both";
})(SaveMode || (SaveMode = {}));
Page({
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
        ],
        showOfficialAccount: false
    },
    onLoad: function (options) {
        canvasPhotoSrc = decodeURIComponent(options.canvasPhotoSrc || '');
        takePhotoSrc = decodeURIComponent(options.takePhotoSrc || '');
    },
    onUnload: function () {
        var eventChannel = this.getOpenerEventChannel();
        eventChannel.emit('handleBack');
    },
    onReady: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                wx.showLoading({
                    title: '处理图片中'
                });
                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, this.initCanvas()];
                            case 1:
                                _a.sent();
                                return [4, this.initAllImage()];
                            case 2:
                                _a.sent();
                                return [4, this.configPicColor()];
                            case 3:
                                _a.sent();
                                this.drawPic();
                                wx.hideLoading();
                                wx.showToast({
                                    title: '处理成功'
                                });
                                return [2];
                        }
                    });
                }); }, 1000);
                return [2];
            });
        });
    },
    onShareAppMessage: function () {
        return getApp().globalData.sharedObj;
    },
    onShareTimeline: function () {
        return getApp().globalData.sharedObj;
    },
    drawPic: function () {
        var _a = wx.getSystemInfoSync(), windowWidth = _a.windowWidth, windowHeight = _a.windowHeight;
        var ctx = configCtx;
        ctx.clearRect(0, 0, windowWidth, windowHeight);
        ctx.drawImage(takePhotoObj, 0, 0, windowWidth, windowHeight);
        ctx.drawImage(canvasPhotoChangeObj, 0, 0, windowWidth, windowHeight - 80);
    },
    initCanvas: function () {
        var _this = this;
        var query = this.createSelectorQuery();
        return new Promise(function (resolve) {
            query.select('#main-canvas')
                .fields({
                node: true,
                size: true
            })
                .exec(function (res) { return __awaiter(_this, void 0, void 0, function () {
                var canvas, dpr, ctx;
                return __generator(this, function (_a) {
                    canvas = res[0].node;
                    dpr = wx.getSystemInfoSync().pixelRatio;
                    canvas.width = res[0].width * dpr;
                    canvas.height = res[0].height * dpr;
                    ctx = canvas.getContext('2d');
                    ctx.scale(dpr, dpr);
                    configCanvas = canvas;
                    configCtx = ctx;
                    resolve(true);
                    return [2];
                });
            }); });
        });
    },
    initAllImage: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.loadImage(canvasPhotoSrc)];
                    case 1:
                        canvasPhotoObj = _a.sent();
                        return [4, this.loadImage(canvasPhotoSrc)];
                    case 2:
                        canvasPhotoChangeObj = _a.sent();
                        return [4, this.loadImage(takePhotoSrc)];
                    case 3:
                        takePhotoObj = _a.sent();
                        return [2];
                }
            });
        });
    },
    loadImage: function (src) {
        var img = configCanvas.createImage();
        img.src = src;
        return new Promise(function (resolve) {
            img.onload = function () {
                resolve(img);
            };
        });
    },
    configPicColor: function (color) {
        if (color === void 0) { color = 'gray'; }
        return __awaiter(this, void 0, void 0, function () {
            var ctx, canvas, _a, windowWidth, windowHeight, imgdata, data, imageData_length, i, n, average, i, n, average, num, i, i, i, n;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        ctx = configCtx;
                        canvas = configCanvas;
                        _a = wx.getSystemInfoSync(), windowWidth = _a.windowWidth, windowHeight = _a.windowHeight;
                        ctx.clearRect(0, 0, windowWidth, windowHeight);
                        ctx.drawImage(canvasPhotoObj, 0, 0, windowWidth, windowHeight - 80);
                        imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        data = imgdata.data;
                        imageData_length = imgdata.data.length / 4;
                        if (color === ColorEnum.Gray) {
                            for (i = 0, n = imgdata.data.length; i < n; i += 4) {
                                average = (data[i] + data[i + 1] + data[i + 2]) / 3;
                                imgdata.data[i] = average;
                                imgdata.data[i + 1] = average;
                                imgdata.data[i + 2] = average;
                            }
                        }
                        if (color === ColorEnum.Black) {
                            for (i = 0, n = imgdata.data.length; i < n; i += 4) {
                                average = (data[i] + data[i + 1] + data[i + 2]) / 3;
                                num = average >= 180 ? 255 : 30;
                                imgdata.data[i] = num;
                                imgdata.data[i + 1] = num;
                                imgdata.data[i + 2] = num;
                            }
                        }
                        else if (color === ColorEnum.Red) {
                            for (i = 0; i < imageData_length; i++) {
                                imgdata.data[i * 4 + 1] = 0;
                                imgdata.data[i * 4 + 2] = 0;
                            }
                        }
                        else if (color === ColorEnum.Blue) {
                            for (i = 0; i < imageData_length; i++) {
                                imgdata.data[i * 4 + 1] = 255;
                                imgdata.data[i * 4 + 2] = 255;
                            }
                        }
                        else if (color === ColorEnum.Obverse) {
                            for (i = 0, n = imgdata.data.length; i < n; i += 4) {
                                imgdata.data[i] = 255 - data[i];
                                imgdata.data[i + 1] = 255 - data[i + 1];
                                imgdata.data[i + 2] = 255 - data[i + 2];
                            }
                        }
                        ctx.putImageData(imgdata, 0, 0);
                        return [4, this.loadImage(canvas.toDataURL())];
                    case 1:
                        canvasPhotoChangeObj = _b.sent();
                        return [2];
                }
            });
        });
    },
    handleColorChange: function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var index, colorGroup, _a, color, _b, toastText;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        index = e.target.dataset.index;
                        colorGroup = this.data.colorGroup;
                        this.setData({
                            activeColorIndex: index
                        });
                        _a = colorGroup[index], color = _a.color, _b = _a.toastText, toastText = _b === void 0 ? '成功' : _b;
                        wx.showLoading({
                            title: '处理图片中'
                        });
                        return [4, this.configPicColor(color)];
                    case 1:
                        _c.sent();
                        this.drawPic();
                        wx.hideLoading();
                        wx.showToast({
                            title: toastText
                        });
                        return [2];
                }
            });
        });
    },
    handleSaveButtonClick: function () {
        this.setData({
            showSaveMode: true
        });
    },
    handleBackClick: function () {
        wx.showModal({
            title: '提示',
            content: '确定取消保存吗?',
            success: function (res) {
                if (res.confirm) {
                    wx.navigateBack();
                }
            }
        });
    },
    handleSaveModeClick: function (e) {
        var mode = e.currentTarget.dataset.mode;
        this.setData({
            saveMode: mode
        });
    },
    handleSaveModeConfirmClick: function () {
        var saveMode = this.data.saveMode;
        wx.showLoading({
            title: '处理中'
        });
        if (saveMode === SaveMode.Both) {
            this._saveForBoth();
        }
        else if (saveMode === SaveMode.NewPic) {
            this._saveForNewPic();
        }
    },
    _saveForBoth: function () {
        var _this = this;
        var filePath = wx.env.USER_DATA_PATH + "/\u90A3\u5E74\u4ECA\u65E5-" + new Date().getTime() + ".png";
        var base64 = configCanvas.toDataURL();
        wx.getFileSystemManager().writeFile({
            filePath: filePath,
            data: base64.slice(22),
            encoding: 'base64',
            success: function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    wx.saveImageToPhotosAlbum({
                        filePath: filePath
                    }).then(function () {
                        wx.hideLoading();
                        wx.showToast({
                            title: '保存成功'
                        });
                        _this._showShared();
                    }).catch(function () {
                        wx.hideLoading();
                        _this._showSaveError();
                    });
                    return [2];
                });
            }); },
            fail: function () {
                wx.hideLoading();
                _this._showSaveError();
            }
        });
    },
    _saveForNewPic: function () {
        var _this = this;
        if (savedFilePath) {
            this._saveToPhotosAlbum(savedFilePath);
            return;
        }
        wx.saveFile({
            tempFilePath: takePhotoSrc,
            success: function (res) {
                savedFilePath = res.savedFilePath;
                _this._saveToPhotosAlbum(savedFilePath);
            },
            fail: function () {
                wx.hideLoading();
                _this._showSaveError();
            }
        });
    },
    _saveToPhotosAlbum: function (savedFilePath) {
        var _this = this;
        wx.saveImageToPhotosAlbum({
            filePath: savedFilePath
        }).then(function () {
            wx.hideLoading();
            wx.showToast({
                title: '保存成功'
            });
            _this._showShared();
        }).catch(function () {
            wx.hideLoading();
            _this._showSaveError();
        });
    },
    _showSaveError: function (title) {
        if (title === void 0) { title = '保存失败'; }
        wx.showToast({
            title: title,
            icon: 'error'
        });
    },
    _showShared: function () {
        this.setData({
            showOfficialAccount: true
        });
        setTimeout(function () {
            wx.showToast({
                title: '快去分享吧'
            });
        }, 1000);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLXBob3RvLXBhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25maWctcGhvdG8tcGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSSxjQUFtQixDQUFDO0FBQ3hCLElBQUksY0FBbUIsQ0FBQztBQUN4QixJQUFJLFlBQWlCLENBQUM7QUFDdEIsSUFBSSxZQUFpQixDQUFDO0FBQ3RCLElBQUksb0JBQXlCLENBQUM7QUFFOUIsSUFBSSxZQUFpQixDQUFDO0FBQ3RCLElBQUksU0FBYyxDQUFDO0FBRW5CLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQztBQUV2QixJQUFLLFNBU0o7QUFURCxXQUFLLFNBQVM7SUFDWiwwQkFBYSxDQUFBO0lBQ2IsMEJBQWEsQ0FBQTtJQUNiLDRCQUFlLENBQUE7SUFDZix3QkFBVyxDQUFBO0lBQ1gsNEJBQWUsQ0FBQTtJQUNmLDBCQUFhLENBQUE7SUFDYiw4QkFBaUIsQ0FBQTtJQUNqQixnQ0FBbUIsQ0FBQTtBQUNyQixDQUFDLEVBVEksU0FBUyxLQUFULFNBQVMsUUFTYjtBQUVELElBQUssUUFHSjtBQUhELFdBQUssUUFBUTtJQUNYLDhCQUFrQixDQUFBO0lBQ2xCLHlCQUFhLENBQUE7QUFDZixDQUFDLEVBSEksUUFBUSxLQUFSLFFBQVEsUUFHWjtBQUVELElBQUksQ0FBQztJQUtILElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxNQUFNO1FBQ1osZ0JBQWdCLEVBQUUsQ0FBQztRQUNuQixVQUFVLEVBQUU7WUFDVjtnQkFDRSxLQUFLLEVBQUUsTUFBTTtnQkFDYixTQUFTLEVBQUUsTUFBTTthQUNsQjtZQUNEO2dCQUNFLEtBQUssRUFBRSxPQUFPO2dCQUNkLFNBQVMsRUFBRSxNQUFNO2FBQ2xCO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsSUFBSSxFQUFFLEdBQUc7Z0JBQ1QsU0FBUyxFQUFFLE1BQU07YUFD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QUFLLEVBQUUsTUFBTTthQUNkLENBQUMsQ0FBQTtZQUNGLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDUCxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDakIsS0FBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELGNBQWMsRUFBZCxVQUFlLEtBQXNCO1FBQXRCLHNCQUFBLEVBQUEsY0FBc0I7UUFDbkMsRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUNYLEtBQUssT0FBQTtZQUNMLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELFdBQVc7UUFDVCxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ1gsbUJBQW1CLEVBQUUsSUFBSTtTQUMxQixDQUFDLENBQUE7UUFDRixVQUFVLENBQUM7WUFDVCxFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUNYLEtBQUssRUFBRSxPQUFPO2FBQ2YsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ1YsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImxldCBjYW52YXNQaG90b1NyYzogYW55O1xubGV0IGNhbnZhc1Bob3RvT2JqOiBhbnk7XG5sZXQgdGFrZVBob3RvU3JjOiBhbnk7XG5sZXQgdGFrZVBob3RvT2JqOiBhbnk7XG5sZXQgY2FudmFzUGhvdG9DaGFuZ2VPYmo6IGFueTtcblxubGV0IGNvbmZpZ0NhbnZhczogYW55O1xubGV0IGNvbmZpZ0N0eDogYW55O1xuXG5sZXQgc2F2ZWRGaWxlUGF0aCA9ICcnO1xuXG5lbnVtIENvbG9yRW51bSB7XG4gIE5vbmUgPSAnbm9uZScsXG4gIEdyYXkgPSAnZ3JheScsXG4gIEJsYWNrID0gJ2JsYWNrJyxcbiAgUmVkID0gJ3JlZCcsXG4gIEdyZWVuID0gJ2dyZWVuJyxcbiAgQmx1ZSA9ICdibHVlJyxcbiAgWWVsbG93ID0gJ3llbGxvdycsXG4gIE9idmVyc2UgPSAnb2J2ZXJzZSdcbn1cblxuZW51bSBTYXZlTW9kZSB7XG4gIE5ld1BpYyA9ICduZXctcGljJyxcbiAgQm90aCA9ICdib3RoJyxcbn1cblxuUGFnZSh7XG5cbiAgLyoqXG4gICAqIOmhtemdoueahOWIneWni+aVsOaNrlxuICAgKi9cbiAgZGF0YToge1xuICAgIG5hbWU6ICduYW1lJyxcbiAgICBhY3RpdmVDb2xvckluZGV4OiAwLFxuICAgIGNvbG9yR3JvdXA6IFtcbiAgICAgIHtcbiAgICAgICAgY29sb3I6ICdncmF5JyxcbiAgICAgICAgdG9hc3RUZXh0OiAn54Gw6Imy5ruk6ZWcJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29sb3I6ICdibGFjaycsXG4gICAgICAgIHRvYXN0VGV4dDogJ+m7keeZvea7pOmVnCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbG9yOiAnbm9uZScsXG4gICAgICAgIHRleHQ6ICfml6AnLFxuICAgICAgICB0b2FzdFRleHQ6ICflj5bmtojmu6TplZwnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb2xvcjogJ29idmVyc2UnLFxuICAgICAgICB0ZXh0OiAn5Y+NJyxcbiAgICAgICAgdG9hc3RUZXh0OiAn5Y+N6Imy5ruk6ZWcJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29sb3I6ICdyZWQnLFxuICAgICAgICB0b2FzdFRleHQ6ICfnuqLoibLmu6TplZwnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb2xvcjogJ2JsdWUnLFxuICAgICAgICB0b2FzdFRleHQ6ICfok53oibLmu6TplZwnXG4gICAgICB9XG4gICAgXSxcbiAgICBzYXZlTW9kZTogU2F2ZU1vZGUuQm90aCxcbiAgICBzaG93U2F2ZU1vZGU6IGZhbHNlLFxuICAgIGJ1dHRvbnM6IFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ3ByaW1hcnknLFxuICAgICAgICBjbGFzc05hbWU6ICdsYXlvdXQtY29uZmlybS1idXR0b24nLFxuICAgICAgICB0ZXh0OiAn5L+d5a2YJyxcbiAgICAgIH1cbiAgICBdLFxuICAgIHNob3dPZmZpY2lhbEFjY291bnQ6IGZhbHNlXG4gIH0sXG5cbiAgLyoqXG4gICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yqg6L29XG4gICAqL1xuICBvbkxvYWQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgY2FudmFzUGhvdG9TcmMgPSBkZWNvZGVVUklDb21wb25lbnQob3B0aW9ucy5jYW52YXNQaG90b1NyYyB8fCAnJyk7XG4gICAgdGFrZVBob3RvU3JjID0gZGVjb2RlVVJJQ29tcG9uZW50KG9wdGlvbnMudGFrZVBob3RvU3JjIHx8ICcnKTtcbiAgfSxcblxuICBvblVubG9hZCgpIHtcbiAgICBjb25zdCBldmVudENoYW5uZWwgPSB0aGlzLmdldE9wZW5lckV2ZW50Q2hhbm5lbCgpXG4gICAgZXZlbnRDaGFubmVsLmVtaXQoJ2hhbmRsZUJhY2snKTtcbiAgfSxcblxuICBhc3luYyBvblJlYWR5KCkge1xuXG4gICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgdGl0bGU6ICflpITnkIblm77niYfkuK0nXG4gICAgfSlcblxuICAgIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdGhpcy5pbml0Q2FudmFzKCk7XG4gICAgICBhd2FpdCB0aGlzLmluaXRBbGxJbWFnZSgpO1xuICAgICAgYXdhaXQgdGhpcy5jb25maWdQaWNDb2xvcigpO1xuXG4gICAgICB0aGlzLmRyYXdQaWMoKTtcblxuICAgICAgd3guaGlkZUxvYWRpbmcoKTtcbiAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgIHRpdGxlOiAn5aSE55CG5oiQ5YqfJ1xuICAgICAgfSlcbiAgICB9LCAxMDAwKVxuICB9LFxuXG4gIG9uU2hhcmVBcHBNZXNzYWdlKCkge1xuICAgIHJldHVybiBnZXRBcHAoKS5nbG9iYWxEYXRhLnNoYXJlZE9ialxuICB9LFxuXG4gIG9uU2hhcmVUaW1lbGluZSgpIHtcbiAgICByZXR1cm4gZ2V0QXBwKCkuZ2xvYmFsRGF0YS5zaGFyZWRPYmpcbiAgfSxcblxuICBkcmF3UGljKCkge1xuICAgIGNvbnN0IHsgd2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCB9ID0gd3guZ2V0U3lzdGVtSW5mb1N5bmMoKTtcbiAgICBjb25zdCBjdHggPSBjb25maWdDdHg7XG5cbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQpO1xuXG4gICAgY3R4LmRyYXdJbWFnZSh0YWtlUGhvdG9PYmosIDAsIDAsIHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQpO1xuXG4gICAgY3R4LmRyYXdJbWFnZShjYW52YXNQaG90b0NoYW5nZU9iaiwgMCwgMCwgd2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCAtIDgwKTtcbiAgfSxcblxuICBpbml0Q2FudmFzKCkge1xuICAgIGNvbnN0IHF1ZXJ5ID0gdGhpcy5jcmVhdGVTZWxlY3RvclF1ZXJ5KClcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAvLyDojrflj5bkuLtjYW52YXNcbiAgICAgIHF1ZXJ5LnNlbGVjdCgnI21haW4tY2FudmFzJylcbiAgICAgICAgLmZpZWxkcyh7XG4gICAgICAgICAgbm9kZTogdHJ1ZSxcbiAgICAgICAgICBzaXplOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIC5leGVjKGFzeW5jIChyZXMpID0+IHtcbiAgICAgICAgICBjb25zdCBjYW52YXMgPSByZXNbMF0ubm9kZVxuICAgICAgICAgIGNvbnN0IGRwciA9IHd4LmdldFN5c3RlbUluZm9TeW5jKCkucGl4ZWxSYXRpb1xuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IHJlc1swXS53aWR0aCAqIGRwclxuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSByZXNbMF0uaGVpZ2h0ICogZHByXG4gICAgICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgY3R4LnNjYWxlKGRwciwgZHByKVxuXG4gICAgICAgICAgY29uZmlnQ2FudmFzID0gY2FudmFzO1xuICAgICAgICAgIGNvbmZpZ0N0eCA9IGN0eDtcblxuICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIH0pXG4gICAgfSlcbiAgfSxcblxuICBhc3luYyBpbml0QWxsSW1hZ2UoKSB7XG4gICAgY2FudmFzUGhvdG9PYmogPSBhd2FpdCB0aGlzLmxvYWRJbWFnZShjYW52YXNQaG90b1NyYyBhcyBzdHJpbmcpO1xuICAgIGNhbnZhc1Bob3RvQ2hhbmdlT2JqID0gYXdhaXQgdGhpcy5sb2FkSW1hZ2UoY2FudmFzUGhvdG9TcmMgYXMgc3RyaW5nKTtcbiAgICB0YWtlUGhvdG9PYmogPSBhd2FpdCB0aGlzLmxvYWRJbWFnZSh0YWtlUGhvdG9TcmMgYXMgc3RyaW5nKTtcbiAgfSxcblxuICBsb2FkSW1hZ2Uoc3JjOiBzdHJpbmcpIHtcbiAgICBjb25zdCBpbWcgPSBjb25maWdDYW52YXMuY3JlYXRlSW1hZ2UoKTtcbiAgICBpbWcuc3JjID0gc3JjO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoaW1nKTtcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuXG4gIGFzeW5jIGNvbmZpZ1BpY0NvbG9yKGNvbG9yOiBzdHJpbmcgPSAnZ3JheScpIHtcbiAgICBjb25zdCBjdHg6IGFueSA9IGNvbmZpZ0N0eDtcbiAgICBjb25zdCBjYW52YXM6IGFueSA9IGNvbmZpZ0NhbnZhcztcbiAgICBjb25zdCB7IHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQgfSA9IHd4LmdldFN5c3RlbUluZm9TeW5jKCk7XG5cbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQpO1xuICAgIGN0eC5kcmF3SW1hZ2UoY2FudmFzUGhvdG9PYmosIDAsIDAsIHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQgLSA4MCk7XG4gICAgY29uc3QgaW1nZGF0YSA9IGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICBjb25zdCBkYXRhID0gaW1nZGF0YS5kYXRhO1xuXG4gICAgLyrngbDluqblpITnkIbvvJrmsYJy77yMZ++8jGLnmoTlnYflgLzvvIzlubbotYvlm57nu5ly77yMZ++8jGIqL1xuICAgIGNvbnN0IGltYWdlRGF0YV9sZW5ndGggPSBpbWdkYXRhLmRhdGEubGVuZ3RoIC8gNDtcblxuICAgIGlmIChjb2xvciA9PT0gQ29sb3JFbnVtLkdyYXkpIHtcbiAgICAgIC8vIOeBsOiJslxuICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBpbWdkYXRhLmRhdGEubGVuZ3RoOyBpIDwgbjsgaSArPSA0KSB7XG4gICAgICAgIGxldCBhdmVyYWdlID0gKGRhdGFbaV0gKyBkYXRhW2kgKyAxXSArIGRhdGFbaSArIDJdKSAvIDM7XG4gICAgICAgIGltZ2RhdGEuZGF0YVtpXSA9IGF2ZXJhZ2U7XG4gICAgICAgIGltZ2RhdGEuZGF0YVtpICsgMV0gPSBhdmVyYWdlO1xuICAgICAgICBpbWdkYXRhLmRhdGFbaSArIDJdID0gYXZlcmFnZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNvbG9yID09PSBDb2xvckVudW0uQmxhY2spIHtcbiAgICAgIC8vIOm7keeZvVxuICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBpbWdkYXRhLmRhdGEubGVuZ3RoOyBpIDwgbjsgaSArPSA0KSB7XG4gICAgICAgIGxldCBhdmVyYWdlID0gKGRhdGFbaV0gKyBkYXRhW2kgKyAxXSArIGRhdGFbaSArIDJdKSAvIDM7XG4gICAgICAgIGNvbnN0IG51bSA9IGF2ZXJhZ2UgPj0gMTgwID8gMjU1IDogMzA7XG4gICAgICAgIGltZ2RhdGEuZGF0YVtpXSA9IG51bTtcbiAgICAgICAgaW1nZGF0YS5kYXRhW2kgKyAxXSA9IG51bTtcbiAgICAgICAgaW1nZGF0YS5kYXRhW2kgKyAyXSA9IG51bTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNvbG9yID09PSBDb2xvckVudW0uUmVkKSB7XG4gICAgICAvLyDnuqLoibJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW1hZ2VEYXRhX2xlbmd0aDsgaSsrKSB7XG4gICAgICAgIGltZ2RhdGEuZGF0YVtpICogNCArIDFdID0gMDtcbiAgICAgICAgaW1nZGF0YS5kYXRhW2kgKiA0ICsgMl0gPSAwO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY29sb3IgPT09IENvbG9yRW51bS5CbHVlKSB7XG4gICAgICAvLyDok53oibJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW1hZ2VEYXRhX2xlbmd0aDsgaSsrKSB7XG4gICAgICAgIGltZ2RhdGEuZGF0YVtpICogNCArIDFdID0gMjU1O1xuICAgICAgICBpbWdkYXRhLmRhdGFbaSAqIDQgKyAyXSA9IDI1NTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNvbG9yID09PSBDb2xvckVudW0uT2J2ZXJzZSkge1xuICAgICAgLy8g5Y+N6ImyXG4gICAgICBmb3IgKGxldCBpID0gMCwgbiA9IGltZ2RhdGEuZGF0YS5sZW5ndGg7IGkgPCBuOyBpICs9IDQpIHtcbiAgICAgICAgaW1nZGF0YS5kYXRhW2ldID0gMjU1IC0gZGF0YVtpXTtcbiAgICAgICAgaW1nZGF0YS5kYXRhW2kgKyAxXSA9IDI1NSAtIGRhdGFbaSArIDFdO1xuICAgICAgICBpbWdkYXRhLmRhdGFbaSArIDJdID0gMjU1IC0gZGF0YVtpICsgMl07XG4gICAgICB9XG4gICAgfVxuXG4gICAgY3R4LnB1dEltYWdlRGF0YShpbWdkYXRhLCAwLCAwKTtcbiAgICAvLyAvKui/lOWbnuWkhOeQhuS7peWQjueahHNyYyovXG4gICAgY2FudmFzUGhvdG9DaGFuZ2VPYmogPSBhd2FpdCB0aGlzLmxvYWRJbWFnZShjYW52YXMudG9EYXRhVVJMKCkpO1xuICB9LFxuXG4gIGFzeW5jIGhhbmRsZUNvbG9yQ2hhbmdlKGU6IGFueSkge1xuICAgIGNvbnN0IGluZGV4ID0gZS50YXJnZXQuZGF0YXNldC5pbmRleDtcbiAgICBjb25zdCBjb2xvckdyb3VwID0gdGhpcy5kYXRhLmNvbG9yR3JvdXA7XG5cbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgYWN0aXZlQ29sb3JJbmRleDogaW5kZXhcbiAgICB9KTtcbiAgICBjb25zdCB7IGNvbG9yLCB0b2FzdFRleHQgPSAn5oiQ5YqfJyB9ID0gY29sb3JHcm91cFtpbmRleF07XG5cbiAgICB3eC5zaG93TG9hZGluZyh7XG4gICAgICB0aXRsZTogJ+WkhOeQhuWbvueJh+S4rSdcbiAgICB9KVxuICAgIGF3YWl0IHRoaXMuY29uZmlnUGljQ29sb3IoY29sb3IpO1xuICAgIHRoaXMuZHJhd1BpYygpO1xuXG4gICAgd3guaGlkZUxvYWRpbmcoKTtcbiAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgdGl0bGU6IHRvYXN0VGV4dFxuICAgIH0pXG4gIH0sXG5cbiAgaGFuZGxlU2F2ZUJ1dHRvbkNsaWNrKCkge1xuICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICBzaG93U2F2ZU1vZGU6IHRydWVcbiAgICB9KVxuICB9LFxuXG4gIGhhbmRsZUJhY2tDbGljaygpIHtcbiAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgdGl0bGU6ICfmj5DnpLonLFxuICAgICAgY29udGVudDogJ+ehruWumuWPlua2iOS/neWtmOWQlz8nLFxuICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XG4gICAgICAgICAgd3gubmF2aWdhdGVCYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBoYW5kbGVTYXZlTW9kZUNsaWNrKGU6IGFueSkge1xuICAgIGNvbnN0IG1vZGUgPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5tb2RlO1xuICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICBzYXZlTW9kZTogbW9kZVxuICAgIH0pXG4gIH0sXG4gIGhhbmRsZVNhdmVNb2RlQ29uZmlybUNsaWNrKCkge1xuICAgIGNvbnN0IHNhdmVNb2RlID0gdGhpcy5kYXRhLnNhdmVNb2RlO1xuICAgIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgIHRpdGxlOiAn5aSE55CG5LitJ1xuICAgIH0pXG5cbiAgICBpZiAoc2F2ZU1vZGUgPT09IFNhdmVNb2RlLkJvdGgpIHtcbiAgICAgIHRoaXMuX3NhdmVGb3JCb3RoKCk7XG4gICAgfSBlbHNlIGlmIChzYXZlTW9kZSA9PT0gU2F2ZU1vZGUuTmV3UGljKSB7XG4gICAgICB0aGlzLl9zYXZlRm9yTmV3UGljKCk7XG4gICAgfVxuICB9LFxuICBfc2F2ZUZvckJvdGgoKSB7XG4gICAgY29uc3QgZmlsZVBhdGggPSBgJHt3eC5lbnYuVVNFUl9EQVRBX1BBVEh9L+mCo+W5tOS7iuaXpS0ke25ldyBEYXRlKCkuZ2V0VGltZSgpfS5wbmdgO1xuXG4gICAgY29uc3QgYmFzZTY0ID0gY29uZmlnQ2FudmFzLnRvRGF0YVVSTCgpXG4gICAgd3guZ2V0RmlsZVN5c3RlbU1hbmFnZXIoKS53cml0ZUZpbGUoe1xuICAgICAgZmlsZVBhdGgsXG4gICAgICBkYXRhOiBiYXNlNjQuc2xpY2UoMjIpLFxuICAgICAgZW5jb2Rpbmc6ICdiYXNlNjQnLFxuICAgICAgc3VjY2VzczogYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyDkv53lrZjmlofku7bliLDnm7jlhoxcbiAgICAgICAgd3guc2F2ZUltYWdlVG9QaG90b3NBbGJ1bSh7XG4gICAgICAgICAgZmlsZVBhdGhcbiAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgd3guaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgICAgdGl0bGU6ICfkv53lrZjmiJDlip8nXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLl9zaG93U2hhcmVkKCk7XG4gICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICB3eC5oaWRlTG9hZGluZygpO1xuICAgICAgICAgIHRoaXMuX3Nob3dTYXZlRXJyb3IoKTtcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICBmYWlsOiAoKSA9PiB7XG4gICAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XG4gICAgICAgIHRoaXMuX3Nob3dTYXZlRXJyb3IoKTtcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBfc2F2ZUZvck5ld1BpYygpIHtcbiAgICAvLyDlt7LmnInnvJPlrZhcbiAgICBpZiAoc2F2ZWRGaWxlUGF0aCkge1xuICAgICAgdGhpcy5fc2F2ZVRvUGhvdG9zQWxidW0oc2F2ZWRGaWxlUGF0aCk7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB3eC5zYXZlRmlsZSh7XG4gICAgICB0ZW1wRmlsZVBhdGg6IHRha2VQaG90b1NyYyxcbiAgICAgIHN1Y2Nlc3M6IChyZXMpID0+IHtcbiAgICAgICAgc2F2ZWRGaWxlUGF0aCA9IHJlcy5zYXZlZEZpbGVQYXRoO1xuICAgICAgICB0aGlzLl9zYXZlVG9QaG90b3NBbGJ1bShzYXZlZEZpbGVQYXRoKTtcbiAgICAgIH0sXG4gICAgICBmYWlsOiAoKSA9PiB7XG4gICAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XG4gICAgICAgIHRoaXMuX3Nob3dTYXZlRXJyb3IoKTtcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBfc2F2ZVRvUGhvdG9zQWxidW0oc2F2ZWRGaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgd3guc2F2ZUltYWdlVG9QaG90b3NBbGJ1bSh7XG4gICAgICBmaWxlUGF0aDogc2F2ZWRGaWxlUGF0aFxuICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgd3guaGlkZUxvYWRpbmcoKTtcbiAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgIHRpdGxlOiAn5L+d5a2Y5oiQ5YqfJ1xuICAgICAgfSlcbiAgICAgIHRoaXMuX3Nob3dTaGFyZWQoKTtcbiAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICB3eC5oaWRlTG9hZGluZygpO1xuICAgICAgdGhpcy5fc2hvd1NhdmVFcnJvcigpO1xuICAgIH0pXG4gIH0sXG4gIF9zaG93U2F2ZUVycm9yKHRpdGxlOiBzdHJpbmcgPSAn5L+d5a2Y5aSx6LSlJykge1xuICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICB0aXRsZSxcbiAgICAgIGljb246ICdlcnJvcidcbiAgICB9KVxuICB9LFxuICBfc2hvd1NoYXJlZCgpIHtcbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgc2hvd09mZmljaWFsQWNjb3VudDogdHJ1ZVxuICAgIH0pXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICB0aXRsZTogJ+W/q+WOu+WIhuS6q+WQpydcbiAgICAgIH0pXG4gICAgfSwgMTAwMClcbiAgfVxufSkiXX0=