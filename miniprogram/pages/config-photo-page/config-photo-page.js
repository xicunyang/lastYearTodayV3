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
        ]
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
        setTimeout(function () {
            wx.showToast({
                title: '快去分享吧'
            });
        }, 1000);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLXBob3RvLXBhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25maWctcGhvdG8tcGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSSxjQUFtQixDQUFDO0FBQ3hCLElBQUksY0FBbUIsQ0FBQztBQUN4QixJQUFJLFlBQWlCLENBQUM7QUFDdEIsSUFBSSxZQUFpQixDQUFDO0FBQ3RCLElBQUksb0JBQXlCLENBQUM7QUFFOUIsSUFBSSxZQUFpQixDQUFDO0FBQ3RCLElBQUksU0FBYyxDQUFDO0FBRW5CLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQztBQUV2QixJQUFLLFNBU0o7QUFURCxXQUFLLFNBQVM7SUFDWiwwQkFBYSxDQUFBO0lBQ2IsMEJBQWEsQ0FBQTtJQUNiLDRCQUFlLENBQUE7SUFDZix3QkFBVyxDQUFBO0lBQ1gsNEJBQWUsQ0FBQTtJQUNmLDBCQUFhLENBQUE7SUFDYiw4QkFBaUIsQ0FBQTtJQUNqQixnQ0FBbUIsQ0FBQTtBQUNyQixDQUFDLEVBVEksU0FBUyxLQUFULFNBQVMsUUFTYjtBQUVELElBQUssUUFHSjtBQUhELFdBQUssUUFBUTtJQUNYLDhCQUFrQixDQUFBO0lBQ2xCLHlCQUFhLENBQUE7QUFDZixDQUFDLEVBSEksUUFBUSxLQUFSLFFBQVEsUUFHWjtBQUVELElBQUksQ0FBQztJQUtILElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxNQUFNO1FBQ1osZ0JBQWdCLEVBQUUsQ0FBQztRQUNuQixVQUFVLEVBQUU7WUFDVjtnQkFDRSxLQUFLLEVBQUUsTUFBTTtnQkFDYixTQUFTLEVBQUUsTUFBTTthQUNsQjtZQUNEO2dCQUNFLEtBQUssRUFBRSxPQUFPO2dCQUNkLFNBQVMsRUFBRSxNQUFNO2FBQ2xCO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsSUFBSSxFQUFFLEdBQUc7Z0JBQ1QsU0FBUyxFQUFFLE1BQU07YUFDbEI7WUFDRDtnQkFDRSxLQUFLLEVBQUUsU0FBUztnQkFDaEIsSUFBSSxFQUFFLEdBQUc7Z0JBQ1QsU0FBUyxFQUFFLE1BQU07YUFDbEI7WUFDRDtnQkFDRSxLQUFLLEVBQUUsS0FBSztnQkFDWixTQUFTLEVBQUUsTUFBTTthQUNsQjtZQUNEO2dCQUNFLEtBQUssRUFBRSxNQUFNO2dCQUNiLFNBQVMsRUFBRSxNQUFNO2FBQ2xCO1NBQ0Y7UUFDRCxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUk7UUFDdkIsWUFBWSxFQUFFLEtBQUs7UUFDbkIsT0FBTyxFQUFFO1lBQ1A7Z0JBQ0UsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsU0FBUyxFQUFFLHVCQUF1QjtnQkFDbEMsSUFBSSxFQUFFLElBQUk7YUFDWDtTQUNGO0tBQ0Y7SUFLRCxNQUFNLEVBQUUsVUFBVSxPQUFPO1FBQ3ZCLGNBQWMsR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ2xFLFlBQVksR0FBRyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUE7UUFDakQsWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUssT0FBTzs7OztnQkFFWCxFQUFFLENBQUMsV0FBVyxDQUFDO29CQUNiLEtBQUssRUFBRSxPQUFPO2lCQUNmLENBQUMsQ0FBQTtnQkFFRixVQUFVLENBQUM7OztvQ0FDVCxXQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBQTs7Z0NBQXZCLFNBQXVCLENBQUM7Z0NBQ3hCLFdBQU0sSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFBOztnQ0FBekIsU0FBeUIsQ0FBQztnQ0FDMUIsV0FBTSxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUE7O2dDQUEzQixTQUEyQixDQUFDO2dDQUU1QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0NBRWYsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dDQUNqQixFQUFFLENBQUMsU0FBUyxDQUFDO29DQUNYLEtBQUssRUFBRSxNQUFNO2lDQUNkLENBQUMsQ0FBQTs7OztxQkFDSCxFQUFFLElBQUksQ0FBQyxDQUFBOzs7O0tBQ1Q7SUFFRCxpQkFBaUI7UUFDZixPQUFPLE1BQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUE7SUFDdEMsQ0FBQztJQUVELGVBQWU7UUFDYixPQUFPLE1BQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUE7SUFDdEMsQ0FBQztJQUVELE9BQU87UUFDQyxJQUFBLEtBQWdDLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxFQUFwRCxXQUFXLGlCQUFBLEVBQUUsWUFBWSxrQkFBMkIsQ0FBQztRQUM3RCxJQUFNLEdBQUcsR0FBRyxTQUFTLENBQUM7UUFFdEIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUUvQyxHQUFHLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUU3RCxHQUFHLENBQUMsU0FBUyxDQUFDLG9CQUFvQixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLFlBQVksR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUQsVUFBVTtRQUFWLGlCQXVCQztRQXRCQyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtRQUN4QyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUEsT0FBTztZQUV4QixLQUFLLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQztpQkFDekIsTUFBTSxDQUFDO2dCQUNOLElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSxJQUFJO2FBQ1gsQ0FBQztpQkFDRCxJQUFJLENBQUMsVUFBTyxHQUFHOzs7b0JBQ1IsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUE7b0JBQ3BCLEdBQUcsR0FBRyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxVQUFVLENBQUE7b0JBQzdDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUE7b0JBQ2pDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUE7b0JBQzdCLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNwQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQTtvQkFFbkIsWUFBWSxHQUFHLE1BQU0sQ0FBQztvQkFDdEIsU0FBUyxHQUFHLEdBQUcsQ0FBQztvQkFFaEIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOzs7aUJBQ2YsQ0FBQyxDQUFBO1FBQ04sQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUssWUFBWSxFQUFsQjs7Ozs0QkFDbUIsV0FBTSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQXdCLENBQUMsRUFBQTs7d0JBQS9ELGNBQWMsR0FBRyxTQUE4QyxDQUFDO3dCQUN6QyxXQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBd0IsQ0FBQyxFQUFBOzt3QkFBckUsb0JBQW9CLEdBQUcsU0FBOEMsQ0FBQzt3QkFDdkQsV0FBTSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQXNCLENBQUMsRUFBQTs7d0JBQTNELFlBQVksR0FBRyxTQUE0QyxDQUFDOzs7OztLQUM3RDtJQUVELFNBQVMsRUFBVCxVQUFVLEdBQVc7UUFDbkIsSUFBTSxHQUFHLEdBQUcsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3ZDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2QsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFBLE9BQU87WUFDeEIsR0FBRyxDQUFDLE1BQU0sR0FBRztnQkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDZixDQUFDLENBQUE7UUFDSCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFSyxjQUFjLEVBQXBCLFVBQXFCLEtBQXNCO1FBQXRCLHNCQUFBLEVBQUEsY0FBc0I7Ozs7Ozt3QkFDbkMsR0FBRyxHQUFRLFNBQVMsQ0FBQzt3QkFDckIsTUFBTSxHQUFRLFlBQVksQ0FBQzt3QkFDM0IsS0FBZ0MsRUFBRSxDQUFDLGlCQUFpQixFQUFFLEVBQXBELFdBQVcsaUJBQUEsRUFBRSxZQUFZLGtCQUFBLENBQTRCO3dCQUU3RCxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO3dCQUMvQyxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxZQUFZLEdBQUcsRUFBRSxDQUFDLENBQUM7d0JBQzlELE9BQU8sR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQzlELElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO3dCQUdwQixnQkFBZ0IsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBRWpELElBQUksS0FBSyxLQUFLLFNBQVMsQ0FBQyxJQUFJLEVBQUU7NEJBRTVCLEtBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO2dDQUNsRCxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dDQUN4RCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztnQ0FDMUIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO2dDQUM5QixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUM7NkJBQy9CO3lCQUNGO3dCQUNELElBQUksS0FBSyxLQUFLLFNBQVMsQ0FBQyxLQUFLLEVBQUU7NEJBRTdCLEtBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO2dDQUNsRCxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dDQUNsRCxHQUFHLEdBQUcsT0FBTyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0NBQ3RDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dDQUN0QixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7Z0NBQzFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQzs2QkFDM0I7eUJBQ0Y7NkJBQU0sSUFBSSxLQUFLLEtBQUssU0FBUyxDQUFDLEdBQUcsRUFBRTs0QkFFbEMsS0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQ0FDekMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQ0FDNUIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs2QkFDN0I7eUJBQ0Y7NkJBQU0sSUFBSSxLQUFLLEtBQUssU0FBUyxDQUFDLElBQUksRUFBRTs0QkFFbkMsS0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQ0FDekMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQ0FDOUIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQzs2QkFDL0I7eUJBQ0Y7NkJBQU0sSUFBSSxLQUFLLEtBQUssU0FBUyxDQUFDLE9BQU8sRUFBRTs0QkFFdEMsS0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0NBQ3RELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDaEMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0NBQ3hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOzZCQUN6Qzt5QkFDRjt3QkFFRCxHQUFHLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBRVQsV0FBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFBOzt3QkFBL0Qsb0JBQW9CLEdBQUcsU0FBd0MsQ0FBQzs7Ozs7S0FDakU7SUFFSyxpQkFBaUIsRUFBdkIsVUFBd0IsQ0FBTTs7Ozs7O3dCQUN0QixLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO3dCQUMvQixVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7d0JBRXhDLElBQUksQ0FBQyxPQUFPLENBQUM7NEJBQ1gsZ0JBQWdCLEVBQUUsS0FBSzt5QkFDeEIsQ0FBQyxDQUFDO3dCQUNHLEtBQThCLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBN0MsS0FBSyxXQUFBLEVBQUUsaUJBQWdCLEVBQWhCLFNBQVMsbUJBQUcsSUFBSSxLQUFBLENBQXVCO3dCQUV0RCxFQUFFLENBQUMsV0FBVyxDQUFDOzRCQUNiLEtBQUssRUFBRSxPQUFPO3lCQUNmLENBQUMsQ0FBQTt3QkFDRixXQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUE7O3dCQUFoQyxTQUFnQyxDQUFDO3dCQUNqQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7d0JBRWYsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUNqQixFQUFFLENBQUMsU0FBUyxDQUFDOzRCQUNYLEtBQUssRUFBRSxTQUFTO3lCQUNqQixDQUFDLENBQUE7Ozs7O0tBQ0g7SUFFRCxxQkFBcUI7UUFDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUNYLFlBQVksRUFBRSxJQUFJO1NBQ25CLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxlQUFlO1FBQ2IsRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUNYLEtBQUssRUFBRSxJQUFJO1lBQ1gsT0FBTyxFQUFFLFVBQVU7WUFDbkIsT0FBTyxZQUFDLEdBQUc7Z0JBQ1QsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFO29CQUNmLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztpQkFDbkI7WUFDSCxDQUFDO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELG1CQUFtQixFQUFuQixVQUFvQixDQUFNO1FBQ3hCLElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUMxQyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ1gsUUFBUSxFQUFFLElBQUk7U0FDZixDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsMEJBQTBCO1FBQ3hCLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3BDLEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDYixLQUFLLEVBQUUsS0FBSztTQUNiLENBQUMsQ0FBQTtRQUVGLElBQUksUUFBUSxLQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUU7WUFDOUIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3JCO2FBQU0sSUFBSSxRQUFRLEtBQUssUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUN2QyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBQ0QsWUFBWTtRQUFaLGlCQTRCQztRQTNCQyxJQUFNLFFBQVEsR0FBTSxFQUFFLENBQUMsR0FBRyxDQUFDLGNBQWMsa0NBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsU0FBTSxDQUFDO1FBRTdFLElBQU0sTUFBTSxHQUFHLFlBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQTtRQUN2QyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxTQUFTLENBQUM7WUFDbEMsUUFBUSxVQUFBO1lBQ1IsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3RCLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLE9BQU8sRUFBRTs7O29CQUVQLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQzt3QkFDeEIsUUFBUSxVQUFBO3FCQUNULENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQ04sRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO3dCQUNqQixFQUFFLENBQUMsU0FBUyxDQUFDOzRCQUNYLEtBQUssRUFBRSxNQUFNO3lCQUNkLENBQUMsQ0FBQTt3QkFDRixLQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ3JCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzt3QkFDUCxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7d0JBQ2pCLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDeEIsQ0FBQyxDQUFDLENBQUE7OztpQkFDSDtZQUNELElBQUksRUFBRTtnQkFDSixFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ2pCLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN4QixDQUFDO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELGNBQWM7UUFBZCxpQkFrQkM7UUFoQkMsSUFBSSxhQUFhLEVBQUU7WUFDakIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3ZDLE9BQU07U0FDUDtRQUVELEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFDVixZQUFZLEVBQUUsWUFBWTtZQUMxQixPQUFPLEVBQUUsVUFBQyxHQUFHO2dCQUNYLGFBQWEsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDO2dCQUNsQyxLQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDekMsQ0FBQztZQUNELElBQUksRUFBRTtnQkFDSixFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ2pCLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN4QixDQUFDO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELGtCQUFrQixFQUFsQixVQUFtQixhQUFxQjtRQUF4QyxpQkFhQztRQVpDLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztZQUN4QixRQUFRLEVBQUUsYUFBYTtTQUN4QixDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ04sRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2pCLEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0JBQ1gsS0FBSyxFQUFFLE1BQU07YUFDZCxDQUFDLENBQUE7WUFDRixLQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ1AsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2pCLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxjQUFjLEVBQWQsVUFBZSxLQUFzQjtRQUF0QixzQkFBQSxFQUFBLGNBQXNCO1FBQ25DLEVBQUUsQ0FBQyxTQUFTLENBQUM7WUFDWCxLQUFLLE9BQUE7WUFDTCxJQUFJLEVBQUUsT0FBTztTQUNkLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxXQUFXO1FBQ1QsVUFBVSxDQUFDO1lBQ1QsRUFBRSxDQUFDLFNBQVMsQ0FBQztnQkFDWCxLQUFLLEVBQUUsT0FBTzthQUNmLENBQUMsQ0FBQTtRQUNKLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUNWLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgY2FudmFzUGhvdG9TcmM6IGFueTtcbmxldCBjYW52YXNQaG90b09iajogYW55O1xubGV0IHRha2VQaG90b1NyYzogYW55O1xubGV0IHRha2VQaG90b09iajogYW55O1xubGV0IGNhbnZhc1Bob3RvQ2hhbmdlT2JqOiBhbnk7XG5cbmxldCBjb25maWdDYW52YXM6IGFueTtcbmxldCBjb25maWdDdHg6IGFueTtcblxubGV0IHNhdmVkRmlsZVBhdGggPSAnJztcblxuZW51bSBDb2xvckVudW0ge1xuICBOb25lID0gJ25vbmUnLFxuICBHcmF5ID0gJ2dyYXknLFxuICBCbGFjayA9ICdibGFjaycsXG4gIFJlZCA9ICdyZWQnLFxuICBHcmVlbiA9ICdncmVlbicsXG4gIEJsdWUgPSAnYmx1ZScsXG4gIFllbGxvdyA9ICd5ZWxsb3cnLFxuICBPYnZlcnNlID0gJ29idmVyc2UnXG59XG5cbmVudW0gU2F2ZU1vZGUge1xuICBOZXdQaWMgPSAnbmV3LXBpYycsXG4gIEJvdGggPSAnYm90aCcsXG59XG5cblBhZ2Uoe1xuXG4gIC8qKlxuICAgKiDpobXpnaLnmoTliJ3lp4vmlbDmja5cbiAgICovXG4gIGRhdGE6IHtcbiAgICBuYW1lOiAnbmFtZScsXG4gICAgYWN0aXZlQ29sb3JJbmRleDogMCxcbiAgICBjb2xvckdyb3VwOiBbXG4gICAgICB7XG4gICAgICAgIGNvbG9yOiAnZ3JheScsXG4gICAgICAgIHRvYXN0VGV4dDogJ+eBsOiJsua7pOmVnCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbG9yOiAnYmxhY2snLFxuICAgICAgICB0b2FzdFRleHQ6ICfpu5Hnmb3mu6TplZwnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjb2xvcjogJ25vbmUnLFxuICAgICAgICB0ZXh0OiAn5pegJyxcbiAgICAgICAgdG9hc3RUZXh0OiAn5Y+W5raI5ruk6ZWcJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29sb3I6ICdvYnZlcnNlJyxcbiAgICAgICAgdGV4dDogJ+WPjScsXG4gICAgICAgIHRvYXN0VGV4dDogJ+WPjeiJsua7pOmVnCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNvbG9yOiAncmVkJyxcbiAgICAgICAgdG9hc3RUZXh0OiAn57qi6Imy5ruk6ZWcJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY29sb3I6ICdibHVlJyxcbiAgICAgICAgdG9hc3RUZXh0OiAn6JOd6Imy5ruk6ZWcJ1xuICAgICAgfVxuICAgIF0sXG4gICAgc2F2ZU1vZGU6IFNhdmVNb2RlLkJvdGgsXG4gICAgc2hvd1NhdmVNb2RlOiBmYWxzZSxcbiAgICBidXR0b25zOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdwcmltYXJ5JyxcbiAgICAgICAgY2xhc3NOYW1lOiAnbGF5b3V0LWNvbmZpcm0tYnV0dG9uJyxcbiAgICAgICAgdGV4dDogJ+S/neWtmCcsXG4gICAgICB9XG4gICAgXVxuICB9LFxuXG4gIC8qKlxuICAgKiDnlJ/lkb3lkajmnJ/lh73mlbAtLeebkeWQrOmhtemdouWKoOi9vVxuICAgKi9cbiAgb25Mb2FkOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIGNhbnZhc1Bob3RvU3JjID0gZGVjb2RlVVJJQ29tcG9uZW50KG9wdGlvbnMuY2FudmFzUGhvdG9TcmMgfHwgJycpO1xuICAgIHRha2VQaG90b1NyYyA9IGRlY29kZVVSSUNvbXBvbmVudChvcHRpb25zLnRha2VQaG90b1NyYyB8fCAnJyk7XG4gIH0sXG5cbiAgb25VbmxvYWQoKSB7XG4gICAgY29uc3QgZXZlbnRDaGFubmVsID0gdGhpcy5nZXRPcGVuZXJFdmVudENoYW5uZWwoKVxuICAgIGV2ZW50Q2hhbm5lbC5lbWl0KCdoYW5kbGVCYWNrJyk7XG4gIH0sXG5cbiAgYXN5bmMgb25SZWFkeSgpIHtcblxuICAgIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgIHRpdGxlOiAn5aSE55CG5Zu+54mH5LitJ1xuICAgIH0pXG5cbiAgICBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHRoaXMuaW5pdENhbnZhcygpO1xuICAgICAgYXdhaXQgdGhpcy5pbml0QWxsSW1hZ2UoKTtcbiAgICAgIGF3YWl0IHRoaXMuY29uZmlnUGljQ29sb3IoKTtcblxuICAgICAgdGhpcy5kcmF3UGljKCk7XG5cbiAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XG4gICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICB0aXRsZTogJ+WkhOeQhuaIkOWKnydcbiAgICAgIH0pXG4gICAgfSwgMTAwMClcbiAgfSxcblxuICBvblNoYXJlQXBwTWVzc2FnZSgpIHtcbiAgICByZXR1cm4gZ2V0QXBwKCkuZ2xvYmFsRGF0YS5zaGFyZWRPYmpcbiAgfSxcblxuICBvblNoYXJlVGltZWxpbmUoKSB7XG4gICAgcmV0dXJuIGdldEFwcCgpLmdsb2JhbERhdGEuc2hhcmVkT2JqXG4gIH0sXG5cbiAgZHJhd1BpYygpIHtcbiAgICBjb25zdCB7IHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQgfSA9IHd4LmdldFN5c3RlbUluZm9TeW5jKCk7XG4gICAgY29uc3QgY3R4ID0gY29uZmlnQ3R4O1xuXG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0KTtcblxuICAgIGN0eC5kcmF3SW1hZ2UodGFrZVBob3RvT2JqLCAwLCAwLCB3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0KTtcblxuICAgIGN0eC5kcmF3SW1hZ2UoY2FudmFzUGhvdG9DaGFuZ2VPYmosIDAsIDAsIHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQgLSA4MCk7XG4gIH0sXG5cbiAgaW5pdENhbnZhcygpIHtcbiAgICBjb25zdCBxdWVyeSA9IHRoaXMuY3JlYXRlU2VsZWN0b3JRdWVyeSgpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgLy8g6I635Y+W5Li7Y2FudmFzXG4gICAgICBxdWVyeS5zZWxlY3QoJyNtYWluLWNhbnZhcycpXG4gICAgICAgIC5maWVsZHMoe1xuICAgICAgICAgIG5vZGU6IHRydWUsXG4gICAgICAgICAgc2l6ZTogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgICAuZXhlYyhhc3luYyAocmVzKSA9PiB7XG4gICAgICAgICAgY29uc3QgY2FudmFzID0gcmVzWzBdLm5vZGVcbiAgICAgICAgICBjb25zdCBkcHIgPSB3eC5nZXRTeXN0ZW1JbmZvU3luYygpLnBpeGVsUmF0aW9cbiAgICAgICAgICBjYW52YXMud2lkdGggPSByZXNbMF0ud2lkdGggKiBkcHJcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gcmVzWzBdLmhlaWdodCAqIGRwclxuICAgICAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgIGN0eC5zY2FsZShkcHIsIGRwcilcblxuICAgICAgICAgIGNvbmZpZ0NhbnZhcyA9IGNhbnZhcztcbiAgICAgICAgICBjb25maWdDdHggPSBjdHg7XG5cbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9KVxuICAgIH0pXG4gIH0sXG5cbiAgYXN5bmMgaW5pdEFsbEltYWdlKCkge1xuICAgIGNhbnZhc1Bob3RvT2JqID0gYXdhaXQgdGhpcy5sb2FkSW1hZ2UoY2FudmFzUGhvdG9TcmMgYXMgc3RyaW5nKTtcbiAgICBjYW52YXNQaG90b0NoYW5nZU9iaiA9IGF3YWl0IHRoaXMubG9hZEltYWdlKGNhbnZhc1Bob3RvU3JjIGFzIHN0cmluZyk7XG4gICAgdGFrZVBob3RvT2JqID0gYXdhaXQgdGhpcy5sb2FkSW1hZ2UodGFrZVBob3RvU3JjIGFzIHN0cmluZyk7XG4gIH0sXG5cbiAgbG9hZEltYWdlKHNyYzogc3RyaW5nKSB7XG4gICAgY29uc3QgaW1nID0gY29uZmlnQ2FudmFzLmNyZWF0ZUltYWdlKCk7XG4gICAgaW1nLnNyYyA9IHNyYztcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICByZXNvbHZlKGltZyk7XG4gICAgICB9XG4gICAgfSlcbiAgfSxcblxuICBhc3luYyBjb25maWdQaWNDb2xvcihjb2xvcjogc3RyaW5nID0gJ2dyYXknKSB7XG4gICAgY29uc3QgY3R4OiBhbnkgPSBjb25maWdDdHg7XG4gICAgY29uc3QgY2FudmFzOiBhbnkgPSBjb25maWdDYW52YXM7XG4gICAgY29uc3QgeyB3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0IH0gPSB3eC5nZXRTeXN0ZW1JbmZvU3luYygpO1xuXG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0KTtcbiAgICBjdHguZHJhd0ltYWdlKGNhbnZhc1Bob3RvT2JqLCAwLCAwLCB3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0IC0gODApO1xuICAgIGNvbnN0IGltZ2RhdGEgPSBjdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgY29uc3QgZGF0YSA9IGltZ2RhdGEuZGF0YTtcblxuICAgIC8q54Gw5bqm5aSE55CG77ya5rGCcu+8jGfvvIxi55qE5Z2H5YC877yM5bm26LWL5Zue57uZcu+8jGfvvIxiKi9cbiAgICBjb25zdCBpbWFnZURhdGFfbGVuZ3RoID0gaW1nZGF0YS5kYXRhLmxlbmd0aCAvIDQ7XG5cbiAgICBpZiAoY29sb3IgPT09IENvbG9yRW51bS5HcmF5KSB7XG4gICAgICAvLyDngbDoibJcbiAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gaW1nZGF0YS5kYXRhLmxlbmd0aDsgaSA8IG47IGkgKz0gNCkge1xuICAgICAgICBsZXQgYXZlcmFnZSA9IChkYXRhW2ldICsgZGF0YVtpICsgMV0gKyBkYXRhW2kgKyAyXSkgLyAzO1xuICAgICAgICBpbWdkYXRhLmRhdGFbaV0gPSBhdmVyYWdlO1xuICAgICAgICBpbWdkYXRhLmRhdGFbaSArIDFdID0gYXZlcmFnZTtcbiAgICAgICAgaW1nZGF0YS5kYXRhW2kgKyAyXSA9IGF2ZXJhZ2U7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjb2xvciA9PT0gQ29sb3JFbnVtLkJsYWNrKSB7XG4gICAgICAvLyDpu5Hnmb1cbiAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gaW1nZGF0YS5kYXRhLmxlbmd0aDsgaSA8IG47IGkgKz0gNCkge1xuICAgICAgICBsZXQgYXZlcmFnZSA9IChkYXRhW2ldICsgZGF0YVtpICsgMV0gKyBkYXRhW2kgKyAyXSkgLyAzO1xuICAgICAgICBjb25zdCBudW0gPSBhdmVyYWdlID49IDE4MCA/IDI1NSA6IDMwO1xuICAgICAgICBpbWdkYXRhLmRhdGFbaV0gPSBudW07XG4gICAgICAgIGltZ2RhdGEuZGF0YVtpICsgMV0gPSBudW07XG4gICAgICAgIGltZ2RhdGEuZGF0YVtpICsgMl0gPSBudW07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjb2xvciA9PT0gQ29sb3JFbnVtLlJlZCkge1xuICAgICAgLy8g57qi6ImyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGltYWdlRGF0YV9sZW5ndGg7IGkrKykge1xuICAgICAgICBpbWdkYXRhLmRhdGFbaSAqIDQgKyAxXSA9IDA7XG4gICAgICAgIGltZ2RhdGEuZGF0YVtpICogNCArIDJdID0gMDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNvbG9yID09PSBDb2xvckVudW0uQmx1ZSkge1xuICAgICAgLy8g6JOd6ImyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGltYWdlRGF0YV9sZW5ndGg7IGkrKykge1xuICAgICAgICBpbWdkYXRhLmRhdGFbaSAqIDQgKyAxXSA9IDI1NTtcbiAgICAgICAgaW1nZGF0YS5kYXRhW2kgKiA0ICsgMl0gPSAyNTU7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjb2xvciA9PT0gQ29sb3JFbnVtLk9idmVyc2UpIHtcbiAgICAgIC8vIOWPjeiJslxuICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBpbWdkYXRhLmRhdGEubGVuZ3RoOyBpIDwgbjsgaSArPSA0KSB7XG4gICAgICAgIGltZ2RhdGEuZGF0YVtpXSA9IDI1NSAtIGRhdGFbaV07XG4gICAgICAgIGltZ2RhdGEuZGF0YVtpICsgMV0gPSAyNTUgLSBkYXRhW2kgKyAxXTtcbiAgICAgICAgaW1nZGF0YS5kYXRhW2kgKyAyXSA9IDI1NSAtIGRhdGFbaSArIDJdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGN0eC5wdXRJbWFnZURhdGEoaW1nZGF0YSwgMCwgMCk7XG4gICAgLy8gLyrov5Tlm57lpITnkIbku6XlkI7nmoRzcmMqL1xuICAgIGNhbnZhc1Bob3RvQ2hhbmdlT2JqID0gYXdhaXQgdGhpcy5sb2FkSW1hZ2UoY2FudmFzLnRvRGF0YVVSTCgpKTtcbiAgfSxcblxuICBhc3luYyBoYW5kbGVDb2xvckNoYW5nZShlOiBhbnkpIHtcbiAgICBjb25zdCBpbmRleCA9IGUudGFyZ2V0LmRhdGFzZXQuaW5kZXg7XG4gICAgY29uc3QgY29sb3JHcm91cCA9IHRoaXMuZGF0YS5jb2xvckdyb3VwO1xuXG4gICAgdGhpcy5zZXREYXRhKHtcbiAgICAgIGFjdGl2ZUNvbG9ySW5kZXg6IGluZGV4XG4gICAgfSk7XG4gICAgY29uc3QgeyBjb2xvciwgdG9hc3RUZXh0ID0gJ+aIkOWKnycgfSA9IGNvbG9yR3JvdXBbaW5kZXhdO1xuXG4gICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgdGl0bGU6ICflpITnkIblm77niYfkuK0nXG4gICAgfSlcbiAgICBhd2FpdCB0aGlzLmNvbmZpZ1BpY0NvbG9yKGNvbG9yKTtcbiAgICB0aGlzLmRyYXdQaWMoKTtcblxuICAgIHd4LmhpZGVMb2FkaW5nKCk7XG4gICAgd3guc2hvd1RvYXN0KHtcbiAgICAgIHRpdGxlOiB0b2FzdFRleHRcbiAgICB9KVxuICB9LFxuXG4gIGhhbmRsZVNhdmVCdXR0b25DbGljaygpIHtcbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgc2hvd1NhdmVNb2RlOiB0cnVlXG4gICAgfSlcbiAgfSxcblxuICBoYW5kbGVCYWNrQ2xpY2soKSB7XG4gICAgd3guc2hvd01vZGFsKHtcbiAgICAgIHRpdGxlOiAn5o+Q56S6JyxcbiAgICAgIGNvbnRlbnQ6ICfnoa7lrprlj5bmtojkv53lrZjlkJc/JyxcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgIGlmIChyZXMuY29uZmlybSkge1xuICAgICAgICAgIHd4Lm5hdmlnYXRlQmFjaygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgaGFuZGxlU2F2ZU1vZGVDbGljayhlOiBhbnkpIHtcbiAgICBjb25zdCBtb2RlID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQubW9kZTtcbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgc2F2ZU1vZGU6IG1vZGVcbiAgICB9KVxuICB9LFxuICBoYW5kbGVTYXZlTW9kZUNvbmZpcm1DbGljaygpIHtcbiAgICBjb25zdCBzYXZlTW9kZSA9IHRoaXMuZGF0YS5zYXZlTW9kZTtcbiAgICB3eC5zaG93TG9hZGluZyh7XG4gICAgICB0aXRsZTogJ+WkhOeQhuS4rSdcbiAgICB9KVxuXG4gICAgaWYgKHNhdmVNb2RlID09PSBTYXZlTW9kZS5Cb3RoKSB7XG4gICAgICB0aGlzLl9zYXZlRm9yQm90aCgpO1xuICAgIH0gZWxzZSBpZiAoc2F2ZU1vZGUgPT09IFNhdmVNb2RlLk5ld1BpYykge1xuICAgICAgdGhpcy5fc2F2ZUZvck5ld1BpYygpO1xuICAgIH1cbiAgfSxcbiAgX3NhdmVGb3JCb3RoKCkge1xuICAgIGNvbnN0IGZpbGVQYXRoID0gYCR7d3guZW52LlVTRVJfREFUQV9QQVRIfS/pgqPlubTku4rml6UtJHtuZXcgRGF0ZSgpLmdldFRpbWUoKX0ucG5nYDtcblxuICAgIGNvbnN0IGJhc2U2NCA9IGNvbmZpZ0NhbnZhcy50b0RhdGFVUkwoKVxuICAgIHd4LmdldEZpbGVTeXN0ZW1NYW5hZ2VyKCkud3JpdGVGaWxlKHtcbiAgICAgIGZpbGVQYXRoLFxuICAgICAgZGF0YTogYmFzZTY0LnNsaWNlKDIyKSxcbiAgICAgIGVuY29kaW5nOiAnYmFzZTY0JyxcbiAgICAgIHN1Y2Nlc3M6IGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8g5L+d5a2Y5paH5Lu25Yiw55u45YaMXG4gICAgICAgIHd4LnNhdmVJbWFnZVRvUGhvdG9zQWxidW0oe1xuICAgICAgICAgIGZpbGVQYXRoXG4gICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XG4gICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgIHRpdGxlOiAn5L+d5a2Y5oiQ5YqfJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5fc2hvd1NoYXJlZCgpO1xuICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgd3guaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgICB0aGlzLl9zaG93U2F2ZUVycm9yKCk7XG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgICAgZmFpbDogKCkgPT4ge1xuICAgICAgICB3eC5oaWRlTG9hZGluZygpO1xuICAgICAgICB0aGlzLl9zaG93U2F2ZUVycm9yKCk7XG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgX3NhdmVGb3JOZXdQaWMoKSB7XG4gICAgLy8g5bey5pyJ57yT5a2YXG4gICAgaWYgKHNhdmVkRmlsZVBhdGgpIHtcbiAgICAgIHRoaXMuX3NhdmVUb1Bob3Rvc0FsYnVtKHNhdmVkRmlsZVBhdGgpO1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgd3guc2F2ZUZpbGUoe1xuICAgICAgdGVtcEZpbGVQYXRoOiB0YWtlUGhvdG9TcmMsXG4gICAgICBzdWNjZXNzOiAocmVzKSA9PiB7XG4gICAgICAgIHNhdmVkRmlsZVBhdGggPSByZXMuc2F2ZWRGaWxlUGF0aDtcbiAgICAgICAgdGhpcy5fc2F2ZVRvUGhvdG9zQWxidW0oc2F2ZWRGaWxlUGF0aCk7XG4gICAgICB9LFxuICAgICAgZmFpbDogKCkgPT4ge1xuICAgICAgICB3eC5oaWRlTG9hZGluZygpO1xuICAgICAgICB0aGlzLl9zaG93U2F2ZUVycm9yKCk7XG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgX3NhdmVUb1Bob3Rvc0FsYnVtKHNhdmVkRmlsZVBhdGg6IHN0cmluZykge1xuICAgIHd4LnNhdmVJbWFnZVRvUGhvdG9zQWxidW0oe1xuICAgICAgZmlsZVBhdGg6IHNhdmVkRmlsZVBhdGhcbiAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgIHd4LmhpZGVMb2FkaW5nKCk7XG4gICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICB0aXRsZTogJ+S/neWtmOaIkOWKnydcbiAgICAgIH0pXG4gICAgICB0aGlzLl9zaG93U2hhcmVkKCk7XG4gICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgd3guaGlkZUxvYWRpbmcoKTtcbiAgICAgIHRoaXMuX3Nob3dTYXZlRXJyb3IoKTtcbiAgICB9KVxuICB9LFxuICBfc2hvd1NhdmVFcnJvcih0aXRsZTogc3RyaW5nID0gJ+S/neWtmOWksei0pScpIHtcbiAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgdGl0bGUsXG4gICAgICBpY29uOiAnZXJyb3InXG4gICAgfSlcbiAgfSxcbiAgX3Nob3dTaGFyZWQoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICB0aXRsZTogJ+W/q+WOu+WIhuS6q+WQpydcbiAgICAgIH0pXG4gICAgfSwgMTAwMClcbiAgfVxufSkiXX0=