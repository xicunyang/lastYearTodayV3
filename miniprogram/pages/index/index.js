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
        isPCMode: false
    },
    onReady: function () {
        this._loadAnimate();
        this._loadForTimelineShared();
        this._loadForPcMode();
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
    handleShow: function () {
        wx.previewImage({
            urls: ['https://bj-mutou-1301404888.cos.ap-beijing.myqcloud.com/lastYearToday/test-money.jpeg']
        });
    },
    handleChoosePic: function () {
        var _this = this;
        if (this.data.isPCMode) {
            wx.showToast({
                title: '请在移动端使用',
                icon: 'error'
            });
            return;
        }
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
    },
    _loadAnimate: function () {
        var _this = this;
        setTimeout(function () {
            _this.setData({
                showAnimate: true
            });
        }, 500);
    },
    _loadForTimelineShared: function () {
        var _this = this;
        var res = wx.getLaunchOptionsSync();
        var scene = res.scene;
        if (scene === 1154) {
            setInterval(function () {
                _this._showError('请点击右下角"前往小程序"体验');
            }, 2000);
        }
    },
    _loadForPcMode: function () {
        var system = wx.getSystemInfoSync().system;
        console.log('system:::', system);
        if (system.includes('macOS') || system.includes('windows')) {
            this.setData({
                isPCMode: true
            });
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBSSxDQUFDO0lBS0gsSUFBSSxFQUFFO1FBQ0osY0FBYyxFQUFFLEtBQUs7UUFDckIsaUJBQWlCLEVBQUUsU0FBUztRQUM1QixhQUFhLEVBQUUsRUFBRTtRQUNqQixTQUFTLEVBQUUsQ0FBQztRQUNaLFVBQVUsRUFBRSxFQUFFO1FBQ2QsT0FBTyxFQUFFO1lBQ1A7Z0JBQ0UsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsU0FBUyxFQUFFLHVCQUF1QjtnQkFDbEMsSUFBSSxFQUFFLEtBQUs7YUFDWjtTQUNGO1FBQ0QsUUFBUSxFQUFFLEVBQUU7UUFDWixTQUFTLEVBQUUsS0FBSztRQUNoQixXQUFXLEVBQUUsS0FBSztRQUNsQixRQUFRLEVBQUUsS0FBSztLQUNoQjtJQUtELE9BQU8sRUFBRTtRQWNQLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELGlCQUFpQjtRQUNmLE9BQU8sTUFBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQTtJQUN0QyxDQUFDO0lBRUQsZUFBZTtRQUNiLE9BQU8sTUFBTSxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQTtJQUN0QyxDQUFDO0lBRUQsWUFBWTtRQUNWLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUMxQyxJQUFJLFdBQVcsS0FBSyxDQUFDLEVBQUU7WUFDckIsV0FBVyxHQUFHLENBQUMsQ0FBQTtTQUNoQjtRQUVELElBQUksQ0FBQyxPQUFPLENBQUM7WUFDWCxTQUFTLEVBQUUsV0FBVztZQUN0QixVQUFVLEVBQUUsR0FBRyxHQUFHLFdBQVcsR0FBRyxHQUFHLEdBQUcsR0FBRztTQUMx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VSxDQUFDO1lBQ1QsS0FBSSxDQUFDLE9BQU8sQ0FBQztnQkFDWCxXQUFXLEVBQUUsSUFBSTthQUNsQixDQUFDLENBQUE7UUFDSixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDVixDQUFDO0lBRUQsc0JBQXNCO1FBQXRCLGlCQVNDO1FBUEMsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDdEMsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUN4QixJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7WUFDbEIsV0FBVyxDQUFDO2dCQUNWLEtBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNyQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7U0FDVDtJQUNILENBQUM7SUFFRCxjQUFjO1FBQ1osSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixFQUFFLENBQUMsTUFBTSxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2pDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzFELElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ1gsUUFBUSxFQUFFLElBQUk7YUFDZixDQUFDLENBQUE7U0FDSDtJQUNILENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB7e3BhZ2V9fS5qc1xuUGFnZSh7XG5cbiAgLyoqXG4gICAqIOmhtemdoueahOWIneWni+aVsOaNrlxuICAgKi9cbiAgZGF0YToge1xuICAgIHNob3dMYXlvdXRNb2RlOiBmYWxzZSxcbiAgICBjaG9vc2VkTGF5b3V0TW9kZTogJ29sZC10b3AnLFxuICAgIGNob29zZWRQaWNTcmM6ICcnLFxuICAgIGd1aWRlU3RlcDogMCxcbiAgICB0cmFuc2xhdGVYOiAnJyxcbiAgICBidXR0b25zOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdwcmltYXJ5JyxcbiAgICAgICAgY2xhc3NOYW1lOiAnbGF5b3V0LWNvbmZpcm0tYnV0dG9uJyxcbiAgICAgICAgdGV4dDogJ+mAieWlveWVpicsXG4gICAgICB9XG4gICAgXSxcbiAgICBlcnJvck1zZzogJycsXG4gICAgc2hvd0Vycm9yOiBmYWxzZSxcbiAgICBzaG93QW5pbWF0ZTogZmFsc2UsXG4gICAgaXNQQ01vZGU6IGZhbHNlXG4gIH0sXG5cbiAgLyoqXG4gICAqIOeUn+WRveWRqOacn+WHveaVsC0t55uR5ZCs6aG16Z2i5Yid5qyh5riy5p+T5a6M5oiQXG4gICAqL1xuICBvblJlYWR5OiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ+W9k+WJjeaXtumXtCAyJywgbmV3IERhdGUoKSk7XG5cbiAgICAvLyB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAvLyAgIC8vIOWkp+WbviBodHRwOi8vdG1wLzJmeTlCMnhYMXB6cTEwNzRkMjU5ZmZmM2I1MTVlZDQ1MjE4NTY0MDc0YWQzLnBuZ1xuICAgIC8vICAgLy8g5bCP5Zu+IGh0dHA6Ly90bXAvalFaTnl5Slc0UUNzMTAyNDczMzIwNWJiMTM5MGNjYmMyMzA4MzJkNjgyNDUucG5nXG4gICAgLy8gICAvLyB1cmw6IGAvcGFnZXMvcGhvdG8tY2FudmFzLXBhZ2UvcGhvdG8tY2FudmFzLXBhZ2U/cGljU3JjPWh0dHBzOi8vYi55emNkbi5jbi90ZXN0LWZpbGUv5pyq5qCH6aKYLTIucG5nYCxcbiAgICAvLyAgIHVybDogYC9wYWdlcy9waG90by1jYW52YXMtcGFnZS9waG90by1jYW52YXMtcGFnZT9waWNTcmM9aHR0cHM6Ly9iLnl6Y2RuLmNuL3Rlc3QtZmlsZS/mnKrmoIfpopgtMi5wbmcmbGF5b3V0TW9kZT1vbGQtZG93bmAsXG4gICAgLy8gfSlcblxuICAgIC8vIHNldEludGVydmFsKCgpID0+IHtcbiAgICAvLyAgIHRoaXMuaGFuZGxlQ2hhbmdlKCk7XG4gICAgLy8gfSwgMzAwMClcblxuICAgIHRoaXMuX2xvYWRBbmltYXRlKCk7XG4gICAgdGhpcy5fbG9hZEZvclRpbWVsaW5lU2hhcmVkKCk7XG4gICAgdGhpcy5fbG9hZEZvclBjTW9kZSgpO1xuICB9LFxuXG4gIG9uU2hhcmVBcHBNZXNzYWdlKCkge1xuICAgIHJldHVybiBnZXRBcHAoKS5nbG9iYWxEYXRhLnNoYXJlZE9ialxuICB9LFxuXG4gIG9uU2hhcmVUaW1lbGluZSgpIHtcbiAgICByZXR1cm4gZ2V0QXBwKCkuZ2xvYmFsRGF0YS5zaGFyZWRPYmpcbiAgfSxcblxuICBoYW5kbGVDaGFuZ2UoKSB7XG4gICAgbGV0IGN1cnJlbnRTdGVwID0gdGhpcy5kYXRhLmd1aWRlU3RlcCArIDE7XG4gICAgaWYgKGN1cnJlbnRTdGVwID09PSA1KSB7XG4gICAgICBjdXJyZW50U3RlcCA9IDBcbiAgICB9XG5cbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgZ3VpZGVTdGVwOiBjdXJyZW50U3RlcCxcbiAgICAgIHRyYW5zbGF0ZVg6ICctJyArIGN1cnJlbnRTdGVwICogMTAwICsgJyUnLFxuICAgIH0pXG4gIH0sXG5cbiAgLy8g56Gu6K6k5oyJ6ZKu54K55Ye7XG4gIGhhbmRsZUxheW91dENvbmZpcm1DbGljaygpIHtcbiAgICB0aGlzLl9qdW1wVG9DYW52YXNQYWdlKCk7XG4gIH0sXG5cbiAgLy8g6YCJ5oupbGF5b3V0SXRlbVxuICBoYW5kbGVMYXlvdXRDaGVjayhlOiBhbnkpIHtcbiAgICBjb25zdCBtb2RlID0gZS5jdXJyZW50VGFyZ2V0LmRhdGFzZXQubW9kZTtcblxuICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICBjaG9vc2VkTGF5b3V0TW9kZTogbW9kZVxuICAgIH0pXG4gIH0sXG5cbiAgaGFuZGxlU2hvdygpIHtcbiAgICB3eC5wcmV2aWV3SW1hZ2Uoe1xuICAgICAgdXJsczogWydodHRwczovL2JqLW11dG91LTEzMDE0MDQ4ODguY29zLmFwLWJlaWppbmcubXlxY2xvdWQuY29tL2xhc3RZZWFyVG9kYXkvdGVzdC1tb25leS5qcGVnJ11cbiAgICB9KVxuICB9LFxuXG4gIGhhbmRsZUNob29zZVBpYygpIHtcbiAgICBpZiAodGhpcy5kYXRhLmlzUENNb2RlKSB7XG4gICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICB0aXRsZTogJ+ivt+WcqOenu+WKqOerr+S9v+eUqCcsXG4gICAgICAgIGljb246ICdlcnJvcidcbiAgICAgIH0pXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIOadg+mZkOagoemqjFxuICAgIHRoaXMuX2F1dGgoKS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlQ2hvb3NlUGljRm4oKTtcbiAgICB9KVxuICB9LFxuXG4gIF9hdXRoKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgociwgaikgPT4ge1xuICAgICAgd3guZ2V0U2V0dGluZyh7XG4gICAgICAgIHN1Y2Nlc3M6IChyZXMpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgIGNvbnN0IGF1dGhTZXR0aW5nID0gcmVzLmF1dGhTZXR0aW5nO1xuXG4gICAgICAgICAgdGhpcy5fYXV0aENhbWVyYShhdXRoU2V0dGluZykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9hdXRoQWxidW0oYXV0aFNldHRpbmcpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAvLyDpgInmi6nlm77niYdcbiAgICAgICAgICAgICAgcih0cnVlKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fc2hvd0Vycm9yKCfkv53lrZjnm7jlhozmnYPpmZDojrflj5blpLHotKXvvIzor7fliKDpmaTph43oo4XlsI/nqIvluo8nKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fc2hvd0Vycm9yKCfnm7jmnLrmnYPpmZDojrflj5blpLHotKXvvIzor7fliKDpmaTph43oo4XlsI/nqIvluo8nKTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG5cbiAgX2F1dGhDYW1lcmEoYXV0aFNldHRpbmc6IGFueSkge1xuICAgIGlmICghYXV0aFNldHRpbmdbJ3Njb3BlLmNhbWVyYSddKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB3eC5hdXRob3JpemUoe1xuICAgICAgICAgIHNjb3BlOiAnc2NvcGUuY2FtZXJhJyxcbiAgICAgICAgICBzdWNjZXNzKCkge1xuICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZhaWwoKSB7XG4gICAgICAgICAgICByZWplY3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH1cbiAgfSxcblxuICBfYXV0aEFsYnVtKGF1dGhTZXR0aW5nOiBhbnkpIHtcbiAgICBpZiAoIWF1dGhTZXR0aW5nWydzY29wZS53cml0ZVBob3Rvc0FsYnVtJ10pIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHd4LmF1dGhvcml6ZSh7XG4gICAgICAgICAgc2NvcGU6ICdzY29wZS53cml0ZVBob3Rvc0FsYnVtJyxcbiAgICAgICAgICBzdWNjZXNzKCkge1xuICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZhaWwoKSB7XG4gICAgICAgICAgICByZWplY3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH1cbiAgfSxcblxuICBoYW5kbGVDaG9vc2VQaWNGbigpIHtcbiAgICB3eC5jaG9vc2VJbWFnZSh7XG4gICAgICBjb3VudDogMSxcbiAgICAgIHN1Y2Nlc3M6IChyZXMpID0+IHtcbiAgICAgICAgY29uc3QgdGVtcEZpbGVQYXRocyA9IHJlcy50ZW1wRmlsZVBhdGhzXG4gICAgICAgIGlmICghdGVtcEZpbGVQYXRoc1swXSkge1xuICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICB0aXRsZTogJ+ivt+mAieaLqeWbvueJhycsXG4gICAgICAgICAgICBpY29uOiAnZXJyb3InLFxuICAgICAgICAgICAgZHVyYXRpb246IDIwMDBcbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICBzaG93TGF5b3V0TW9kZTogdHJ1ZSxcbiAgICAgICAgICBjaG9vc2VkUGljU3JjOiB0ZW1wRmlsZVBhdGhzWzBdLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG5cbiAgLy8g6Lez6L2s5Yiw5aSE55CG6aG1XG4gIF9qdW1wVG9DYW52YXNQYWdlKCkge1xuICAgIGNvbnN0IHBpY1NyYyA9IHRoaXMuZGF0YS5jaG9vc2VkUGljU3JjO1xuICAgIGNvbnN0IGxheW91dE1vZGUgPSB0aGlzLmRhdGEuY2hvb3NlZExheW91dE1vZGU7XG4gICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICB1cmw6IGAvcGFnZXMvcGhvdG8tY2FudmFzLXBhZ2UvcGhvdG8tY2FudmFzLXBhZ2U/cGljU3JjPSR7cGljU3JjfSZsYXlvdXRNb2RlPSR7bGF5b3V0TW9kZX1gLFxuICAgIH0pXG4gIH0sXG5cbiAgX3Nob3dFcnJvcihtc2c6IHN0cmluZykge1xuICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICBlcnJvck1zZzogbXNnLFxuICAgICAgc2hvd0Vycm9yOiB0cnVlXG4gICAgfSlcbiAgfSxcblxuICBfbG9hZEFuaW1hdGUoKSB7XG4gICAgLy8g5Yqo55S7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBzaG93QW5pbWF0ZTogdHJ1ZVxuICAgICAgfSlcbiAgICB9LCA1MDApO1xuICB9LFxuXG4gIF9sb2FkRm9yVGltZWxpbmVTaGFyZWQoKSB7XG4gICAgLy8g5pyL5Y+L5ZyI5YiG5Lqr5ZCO5omT5byA55qE5Y2V6aG15qih5byPXG4gICAgY29uc3QgcmVzID0gd3guZ2V0TGF1bmNoT3B0aW9uc1N5bmMoKTtcbiAgICBjb25zdCBzY2VuZSA9IHJlcy5zY2VuZTtcbiAgICBpZiAoc2NlbmUgPT09IDExNTQpIHtcbiAgICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgdGhpcy5fc2hvd0Vycm9yKCfor7fngrnlh7vlj7PkuIvop5JcIuWJjeW+gOWwj+eoi+W6j1wi5L2T6aqMJyk7XG4gICAgICB9LCAyMDAwKVxuICAgIH1cbiAgfSxcblxuICBfbG9hZEZvclBjTW9kZSgpIHtcbiAgICBjb25zdCBzeXN0ZW0gPSB3eC5nZXRTeXN0ZW1JbmZvU3luYygpLnN5c3RlbTtcbiAgICBjb25zb2xlLmxvZygnc3lzdGVtOjo6Jywgc3lzdGVtKTtcbiAgICBpZiAoc3lzdGVtLmluY2x1ZGVzKCdtYWNPUycpIHx8IHN5c3RlbS5pbmNsdWRlcygnd2luZG93cycpKSB7XG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICBpc1BDTW9kZTogdHJ1ZVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn0pIl19