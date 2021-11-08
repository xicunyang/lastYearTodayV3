"use strict";
Page({
    data: {
        showLayoutMode: false,
        choosedLayoutMode: 'old-top',
        choosedPicSrc: '',
        guideStep: 0,
        translateX: '',
        buttons: [
            {
                type: 'primary',
                className: 'layout-confirm-button',
                text: '选好啦',
            }
        ],
        errorMsg: '',
        showError: false,
        showAnimate: false,
    },
    onReady: function () {
        var _this = this;
        console.log('当前时间', new Date());
        setTimeout(function () {
            _this.setData({
                showAnimate: true
            });
        }, 500);
        var res = wx.getLaunchOptionsSync();
        var scene = res.scene;
        if (scene === 1154) {
            setInterval(function () {
                _this._showError('请点击右下角"前往小程序"体验');
            }, 2000);
        }
    },
    onShareAppMessage: function () {
        return getApp().globalData.sharedObj;
    },
    onShareTimeline: function () {
        return getApp().globalData.sharedObj;
    },
    handleChange: function () {
        var currentStep = this.data.guideStep + 1;
        if (currentStep === 5) {
            currentStep = 0;
        }
        this.setData({
            guideStep: currentStep,
            translateX: '-' + currentStep * 100 + '%',
        });
    },
    handleLayoutConfirmClick: function () {
        this._jumpToCanvasPage();
    },
    handleLayoutCheck: function (e) {
        var mode = e.currentTarget.dataset.mode;
        this.setData({
            choosedLayoutMode: mode
        });
    },
    handleChoosePic: function () {
        var _this = this;
        this._auth().then(function () {
            _this.handleChoosePicFn();
        });
    },
    _auth: function () {
        var _this = this;
        return new Promise(function (r, j) {
            wx.getSetting({
                success: function (res) {
                    console.log(res);
                    var authSetting = res.authSetting;
                    _this._authCamera(authSetting).then(function () {
                        _this._authAlbum(authSetting).then(function () {
                            r(true);
                        }).catch(function () {
                            _this._showError('保存相册权限获取失败，请删除重装小程序');
                        });
                    }).catch(function () {
                        _this._showError('相机权限获取失败，请删除重装小程序');
                    });
                }
            });
        });
    },
    _authCamera: function (authSetting) {
        if (!authSetting['scope.camera']) {
            return new Promise(function (resolve, reject) {
                wx.authorize({
                    scope: 'scope.camera',
                    success: function () {
                        resolve(true);
                    },
                    fail: function () {
                        reject();
                    }
                });
            });
        }
        else {
            return Promise.resolve(true);
        }
    },
    _authAlbum: function (authSetting) {
        if (!authSetting['scope.writePhotosAlbum']) {
            return new Promise(function (resolve, reject) {
                wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success: function () {
                        resolve(true);
                    },
                    fail: function () {
                        reject();
                    }
                });
            });
        }
        else {
            return Promise.resolve(true);
        }
    },
    handleChoosePicFn: function () {
        var _this = this;
        wx.chooseImage({
            count: 1,
            success: function (res) {
                var tempFilePaths = res.tempFilePaths;
                if (!tempFilePaths[0]) {
                    wx.showToast({
                        title: '请选择图片',
                        icon: 'error',
                        duration: 2000
                    });
                }
                _this.setData({
                    showLayoutMode: true,
                    choosedPicSrc: tempFilePaths[0],
                });
            }
        });
    },
    _jumpToCanvasPage: function () {
        var picSrc = this.data.choosedPicSrc;
        var layoutMode = this.data.choosedLayoutMode;
        wx.navigateTo({
            url: "/pages/photo-canvas-page/photo-canvas-page?picSrc=" + picSrc + "&layoutMode=" + layoutMode,
        });
    },
    _showError: function (msg) {
        this.setData({
            errorMsg: msg,
            showError: true
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBSSxDQUFDO0lBS0gsSUFBSSxFQUFFO1FBQ0osY0FBYyxFQUFFLEtBQUs7UUFDckIsaUJBQWlCLEVBQUUsU0FBUztRQUM1QixhQUFhLEVBQUUsRUFBRTtRQUNqQixTQUFTLEVBQUUsQ0FBQztRQUNaLFVBQVUsRUFBRSxFQUFFO1FBQ2QsT0FBTyxFQUFFO1lBQ1A7Z0JBQ0UsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsU0FBUyxFQUFFLHVCQUF1QjtnQkFDbEMsSUFBSSxFQUFFLEtBQUs7YUFDWjtTQUNGO1FBQ0QsUUFBUSxFQUFFLEVBQUU7UUFDWixTQUFTLEVBQUUsS0FBSztRQUNoQixXQUFXLEVBQUUsS0FBSztLQUNuQjtJQUtELE9BQU8sRUFBRTtRQUFBLGlCQTZCUjtRQTVCQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLENBQUM7UUFjaEMsVUFBVSxDQUFDO1lBQ1QsS0FBSSxDQUFDLE9BQU8sQ0FBQztnQkFDWCxXQUFXLEVBQUUsSUFBSTthQUNsQixDQUFDLENBQUE7UUFDSixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFHUixJQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUN0QyxJQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO1FBQ3hCLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtZQUNsQixXQUFXLENBQUM7Z0JBQ1YsS0FBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3JDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtTQUNUO0lBQ0gsQ0FBQztJQUVELGlCQUFpQjtRQUNmLE9BQU8sTUFBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQTtJQUN0QyxDQUFDO0lBRUQsZUFBZTtRQUNiLE9BQU8s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QUMsQ0FBQTtJQUNKLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB7e3BhZ2V9fS5qc1xuUGFnZSh7XG5cbiAgLyoqXG4gICAqIOmhtemdoueahOWIneWni+aVsOaNrlxuICAgKi9cbiAgZGF0YToge1xuICAgIHNob3dMYXlvdXRNb2RlOiBmYWxzZSxcbiAgICBjaG9vc2VkTGF5b3V0TW9kZTogJ29sZC10b3AnLFxuICAgIGNob29zZWRQaWNTcmM6ICcnLFxuICAgIGd1aWRlU3RlcDogMCxcbiAgICB0cmFuc2xhdGVYOiAnJyxcbiAgICBidXR0b25zOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdwcmltYXJ5JyxcbiAgICAgICAgY2xhc3NOYW1lOiAnbGF5b3V0LWNvbmZpcm0tYnV0dG9uJyxcbiAgICAgICAgdGV4dDogJ+mAieWlveWVpicsXG4gICAgICB9XG4gICAgXSxcbiAgICBlcnJvck1zZzogJycsXG4gICAgc2hvd0Vycm9yOiBmYWxzZSxcbiAgICBzaG93QW5pbWF0ZTogZmFsc2UsXG4gIH0sXG5cbiAgLyoqXG4gICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yid5qyh5riy5p+T5a6M5oiQXG4gICAqL1xuICBvblJlYWR5OiBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ+W9k+WJjeaXtumXtCcsIG5ldyBEYXRlKCkpO1xuXG4gICAgLy8gd3gubmF2aWdhdGVUbyh7XG4gICAgLy8gICAvLyDlpKflm74gaHR0cDovL3RtcC8yZnk5QjJ4WDFwenExMDc0ZDI1OWZmZjNiNTE1ZWQ0NTIxODU2NDA3NGFkMy5wbmdcbiAgICAvLyAgIC8vIOWwj+WbviBodHRwOi8vdG1wL2pRWk55eUpXNFFDczEwMjQ3MzMyMDViYjEzOTBjY2JjMjMwODMyZDY4MjQ1LnBuZ1xuICAgIC8vICAgLy8gdXJsOiBgL3BhZ2VzL3Bob3RvLWNhbnZhcy1wYWdlL3Bob3RvLWNhbnZhcy1wYWdlP3BpY1NyYz1odHRwczovL2IueXpjZG4uY24vdGVzdC1maWxlL+acquagh+mimC0yLnBuZ2AsXG4gICAgLy8gICB1cmw6IGAvcGFnZXMvcGhvdG8tY2FudmFzLXBhZ2UvcGhvdG8tY2FudmFzLXBhZ2U/cGljU3JjPWh0dHA6Ly90bXAvOTI4V0tYQlVJa1dUMTA3NGQyNTlmZmYzYjUxNWVkNDUyMTg1NjQwNzRhZDMucG5nJmxheW91dE1vZGU9b2xkLWRvd25gLFxuICAgIC8vIH0pXG5cbiAgICAvLyBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgLy8gICB0aGlzLmhhbmRsZUNoYW5nZSgpO1xuICAgIC8vIH0sIDMwMDApXG5cbiAgICAvLyDliqjnlLtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIHNob3dBbmltYXRlOiB0cnVlXG4gICAgICB9KVxuICAgIH0sIDUwMCk7XG5cbiAgICAvLyDmnIvlj4vlnIjliIbkuqvlkI7miZPlvIDnmoTljZXpobXmqKHlvI9cbiAgICBjb25zdCByZXMgPSB3eC5nZXRMYXVuY2hPcHRpb25zU3luYygpO1xuICAgIGNvbnN0IHNjZW5lID0gcmVzLnNjZW5lO1xuICAgIGlmIChzY2VuZSA9PT0gMTE1NCkge1xuICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICB0aGlzLl9zaG93RXJyb3IoJ+ivt+eCueWHu+WPs+S4i+inklwi5YmN5b6A5bCP56iL5bqPXCLkvZPpqownKTtcbiAgICAgIH0sIDIwMDApXG4gICAgfVxuICB9LFxuXG4gIG9uU2hhcmVBcHBNZXNzYWdlKCkge1xuICAgIHJldHVybiBnZXRBcHAoKS5nbG9iYWxEYXRhLnNoYXJlZE9ialxuICB9LFxuXG4gIG9uU2hhcmVUaW1lbGluZSgpIHtcbiAgICByZXR1cm4gZ2V0QXBwKCkuZ2xvYmFsRGF0YS5zaGFyZWRPYmpcbiAgfSxcblxuICBoYW5kbGVDaGFuZ2UoKSB7XG4gICAgbGV0IGN1cnJlbnRTdGVwID0gdGhpcy5kYXRhLmd1aWRlU3RlcCArIDE7XG4gICAgaWYgKGN1cnJlbnRTdGVwID09PSA1KSB7XG4gICAgICBjdXJyZW50U3RlcCA9IDBcbiAgICB9XG5cbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgZ3VpZGVTdGVwOiBjdXJyZW50U3RlcCxcbiAgICAgIHRyYW5zbGF0ZVg6ICctJyArIGN1cnJlbnRTdGVwICogMTAwICsgJyUnLFxuICAgIH0pXG4gIH0sXG5cbiAgLy8g56Gu6K6k5oyJ6ZKu54K55Ye7XG4gIGhhbmRsZUxheW91dENvbmZpcm1DbGljaygpIHtcbiAgICB0aGlzLl9qdW1wVG9DYW52YXNQYWdlKCk7XG4gIH0sXG5cbiAgLy8g6YCJ5oupbGF5b3V0SXRlbVxuICBoYW5kbGVMYXlvdXRDaGVjayhlOiBhbnkpIHtcbiAgICBjb25zdCBtb2RlID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQubW9kZTtcblxuICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICBjaG9vc2VkTGF5b3V0TW9kZTogbW9kZVxuICAgIH0pXG4gIH0sXG5cbiAgaGFuZGxlQ2hvb3NlUGljKCkge1xuICAgIC8vIOadg+mZkOagoemqjFxuICAgIHRoaXMuX2F1dGgoKS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlQ2hvb3NlUGljRm4oKTtcbiAgICB9KVxuICB9LFxuXG4gIF9hdXRoKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgociwgaikgPT4ge1xuICAgICAgd3guZ2V0U2V0dGluZyh7XG4gICAgICAgIHN1Y2Nlc3M6IChyZXMpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgIGNvbnN0IGF1dGhTZXR0aW5nID0gcmVzLmF1dGhTZXR0aW5nO1xuXG4gICAgICAgICAgdGhpcy5fYXV0aENhbWVyYShhdXRoU2V0dGluZykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9hdXRoQWxidW0oYXV0aFNldHRpbmcpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAvLyDpgInmi6nlm77niYdcbiAgICAgICAgICAgICAgcih0cnVlKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fc2hvd0Vycm9yKCfkv53lrZjnm7jlhozmnYPpmZDojrflj5blpLHotKXvvIzor7fliKDpmaTph43oo4XlsI/nqIvluo8nKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fc2hvd0Vycm9yKCfnm7jmnLrmnYPpmZDojrflj5blpLHotKXvvIzor7fliKDpmaTph43oo4XlsI/nqIvluo8nKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG5cbiAgX2F1dGhDYW1lcmEoYXV0aFNldHRpbmc6IGFueSkge1xuICAgIGlmICghYXV0aFNldHRpbmdbJ3Njb3BlLmNhbWVyYSddKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB3eC5hdXRob3JpemUoe1xuICAgICAgICAgIHNjb3BlOiAnc2NvcGUuY2FtZXJhJyxcbiAgICAgICAgICBzdWNjZXNzKCkge1xuICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZhaWwoKSB7XG4gICAgICAgICAgICByZWplY3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH1cbiAgfSxcblxuICBfYXV0aEFsYnVtKGF1dGhTZXR0aW5nOiBhbnkpIHtcbiAgICBpZiAoIWF1dGhTZXR0aW5nWydzY29wZS53cml0ZVBob3Rvc0FsYnVtJ10pIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHd4LmF1dGhvcml6ZSh7XG4gICAgICAgICAgc2NvcGU6ICdzY29wZS53cml0ZVBob3Rvc0FsYnVtJyxcbiAgICAgICAgICBzdWNjZXNzKCkge1xuICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZhaWwoKSB7XG4gICAgICAgICAgICByZWplY3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH1cbiAgfSxcblxuICBoYW5kbGVDaG9vc2VQaWNGbigpIHtcbiAgICB3eC5jaG9vc2VJbWFnZSh7XG4gICAgICBjb3VudDogMSxcbiAgICAgIHN1Y2Nlc3M6IChyZXMpID0+IHtcbiAgICAgICAgY29uc3QgdGVtcEZpbGVQYXRocyA9IHJlcy50ZW1wRmlsZVBhdGhzXG4gICAgICAgIGlmICghdGVtcEZpbGVQYXRoc1swXSkge1xuICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICB0aXRsZTogJ+ivt+mAieaLqeWbvueJhycsXG4gICAgICAgICAgICBpY29uOiAnZXJyb3InLFxuICAgICAgICAgICAgZHVyYXRpb246IDIwMDBcbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICBzaG93TGF5b3V0TW9kZTogdHJ1ZSxcbiAgICAgICAgICBjaG9vc2VkUGljU3JjOiB0ZW1wRmlsZVBhdGhzWzBdLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG5cbiAgLy8g6Lez6L2s5Yiw5aSE55CG6aG1XG4gIF9qdW1wVG9DYW52YXNQYWdlKCkge1xuICAgIGNvbnN0IHBpY1NyYyA9IHRoaXMuZGF0YS5jaG9vc2VkUGljU3JjO1xuICAgIGNvbnN0IGxheW91dE1vZGUgPSB0aGlzLmRhdGEuY2hvb3NlZExheW91dE1vZGU7XG4gICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICB1cmw6IGAvcGFnZXMvcGhvdG8tY2FudmFzLXBhZ2UvcGhvdG8tY2FudmFzLXBhZ2U/cGljU3JjPSR7cGljU3JjfSZsYXlvdXRNb2RlPSR7bGF5b3V0TW9kZX1gLFxuICAgIH0pXG4gIH0sXG5cbiAgX3Nob3dFcnJvcihtc2c6IHN0cmluZykge1xuICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICBlcnJvck1zZzogbXNnLFxuICAgICAgc2hvd0Vycm9yOiB0cnVlXG4gICAgfSlcbiAgfVxufSkiXX0=