export default {
  data: function () {
    return {
      resizing: null,
      startX: 0,
      startWidth: 0
    }
  },
  mounted: function () {
    document.addEventListener('mousemove', e => {
      if (!this.resizing) return
      this.resizeHandler(this.resizing, this.startWidth + (e.pageX - this.startX))
    })
    document.addEventListener('mouseup', () => this.stopResize())
  },
  methods: {
    resizeHandler: function (element, newWidth) {
      element.style.width = `${newWidth}px`
    },
    startResize (e, element) {
      this.startX = e.pageX
      this.resizing = element
      this.startWidth = parseFloat(element.style.width)
    },
    stopResize () {
      this.resizing = null
    }
  }
}
