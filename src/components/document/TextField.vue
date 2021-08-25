<template>
  <div
    :class="{__bold: object.isHeading}"
    @click="editText(true)"
  >
    <span
      v-if="!edit"
      class="__text"
    >{{ parseText() }}</span>
    <textarea
      v-if="edit"
      ref="edit"
      v-model.lazy="text"
      class="__textarea"
      @blur="editText(false)"
      @change="resize()"
      @cut="resize()"
      @paste="resize()"
      @drop="resize()"
      @keydown="resize()"
      @focus="resize()"
    />
  </div>
</template>

<script>
export default {
  name: 'TextField',
  props: {
    object: {
      type: Object,
      default: null
    },
    name: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      edit: false
    }
  },
  computed: {
    text: {
      get: function () {
        return this.object[this.name]
      },
      set: function (value) {
        this.$store.findObject(this.object.uid)[this.name] = value
      }
    }
  },
  methods: {
    resize () {
      const text = this.$refs.edit
      setTimeout(() => {
        text.style.height = 'auto'
        text.style.height = text.scrollHeight + 'px'
      }, 0)
    },
    editText (edit) {
      console.log('Here: ', this.object[this.name])
      this.edit = edit
      if (edit) this.$nextTick(() => this.$refs.edit.focus())
    },
    parseText () {
      return this.object[this.name]
    }
  }
}
</script>

<style scoped>
.__noBreak{
  white-space: nowrap;
}

.__bold {
  font-weight: bold;
}

.__text {
  white-space: pre-wrap;
}

.__textarea {
  outline: none;
  background-color: #e6e6e6;
  width: 100%;
  border: none;
  resize: vertical;
  overflow: hidden;
}
</style>
