// {{component}}.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleUploadImg() {
      wx.chooseImage({
        count: 1,
        success: (res) => {
          const tempFilePaths = res.tempFilePaths
          if (!tempFilePaths[0]) {
            wx.showToast({
              title: '请选择图片',
              icon: 'error',
              duration: 2000
            })
          }

          this.triggerEvent('choosed', tempFilePaths[0])
        }
      })
    }
  }
})