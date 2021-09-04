<template>
  <div
    class="__textField"
    @click="editText(true)"
  >
    <span
      v-if="object.isHeading"
      class="__heading"
    >
      {{ object.chapter }}.
    </span>
    <div
      v-if="!edit"
      :class="{__heading: object.isHeading}"
      class="__text"
      v-html="getText()"
    />
    <div
      v-if="edit"
      class="__trix"
      @click.stop
    >
      <input
        :id="object.uid"
        :value="getText()"
        type="hidden"
        :name="`content${object.uid}`"
      >
      <trix-editor
        ref="edit"
        :input="object.uid"
        @trix-blur="editText(false)"
        @trix-change="onChange($event)"
      />
    </div>
  </div>
</template>

<script>
import 'trix'
import 'trix/dist/trix.css'
import { mapMutations } from 'vuex'

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
  methods: {
    ...mapMutations('objects', ['setObjectProperty']),
    getText () {
      return this.object[this.name]
    },
    onChange (e) {
      this.setObjectProperty({ object: this.object, key: this.name, value: e.target.value })
    },
    editText (edit) {
      this.edit = edit
      if (edit) this.$nextTick(() => this.$refs.edit.focus())
    }
  }
}
</script>

<style>
.__textField {

}

.__textField .__heading {
  font-size: 1rem;
  font-weight: bold;
}

.__textField .__text {
  display: inline-block;
}

.__textField .__trix .trix-button-group {
  background-color: var(--bg-light1);
}

.__textField .__trix trix-editor {
  background-color: var(--bg-light1);
  color: black;
  cursor: text;
}

.__textField .__trix .trix-button-group--file-tools{
  display: none;
}
</style>
