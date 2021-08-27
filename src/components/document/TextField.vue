<template>
  <div
    @click.stop="editText(true)"
  >
    <span
      v-if="object.isHeading"
      class="__heading"
    >
      {{ object.chapter }}.
    </span>
    <span
      v-if="!edit"
      :class="{__heading: object.isHeading}"
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
        this.$store.getObjectById(this.object.uid)[this.name] = value
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
      this.edit = edit
      if (edit) this.$nextTick(() => this.$refs.edit.focus())
      if (!edit) this.$store.calculateChapters(this.$store.state.activeDocument.uid)
    },
    parseText () {
      return this.object[this.name] + this.object.order
    }
  }
}
</script>

<style scoped>
.__noBreak{
  white-space: nowrap;
}

.__heading {
  font-size: 1rem;
  font-weight: bold;
}

.__text {
  white-space: pre-wrap;
}

.__textarea {
  outline: none;
  background-color: var(--bg-light);
  width: 100%;
  border: none;
  resize: vertical;
  overflow: hidden;
}
</style>
