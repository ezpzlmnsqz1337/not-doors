<template>
  <div class="__field" >
    <div v-if="column.type === 'string'" :class="{__bold: object.isHeading}" @click="editText(true)">
      <span v-if="!edit">{{ parseText() }}</span>
      <textarea
        v-if="edit"
        v-model.lazy="text"
        @blur="editText(false)"
        @change="resize()"
        @cut="resize()"
        @paste="resize()"
        @drop="resize()"
        @keydown="resize()"
        @focus="resize()"
        ref="edit"
        class="__textarea"></textarea>
    </div>
    <div v-if="column.type === 'number'">{{ object[column.name] }}</div>
    <div v-if="column.type === 'enum'">
      <div v-for="(v, index) in column.values"
        :key="`enum-${v}${index}${object[column.name]}`"
        class="__noBreak"
      >
        <input
          :id="`${object.uid}${index}`"
          :type="column.multiple ? 'checkbox' : 'radio'"
          :name="`${object.uid}`"
          :checked="object[column.name].includes(v)"
          :value="v"
          @input="setEnumValue"
          @click.stop
        />
        <label :for="`${object.uid}${index}`">{{ v }}</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Field',
  props: {
    object: {
      type: Object,
      default: null
    },
    column: {
      type: Object,
      default: null
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
        return this.object.text
      },
      set: function (value) {
        this.$store.findObject(this.object.uid).text = value
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
    },
    parseText () {
      return this.object[this.column.name]
    },
    setEnumValue (e) {
      const o = this.$store.findObject(this.object.uid)
      if (this.column.multiple) {
        const index = o[this.column.name].findIndex(x => x === e.target.value)
        if (index !== -1) {
          o[this.column.name].splice(index, 1)
        } else {
          o[this.column.name].push(e.target.value)
        }
      } else {
        o[this.column.name] = e.target.value
      }
    }
  }
}
</script>

<style scoped>
.__field{
  cursor: pointer;
  padding: 0.2rem 0.7rem;
}

.__field label:hover, .__field input:hover {
  cursor: pointer;
  color: #a4a4a4;
}

.__field:hover input, .__field:hover label{

}

.__enum input, .__enum label {
  display: none;
}

.__enum:hover input, .__enum:hover label {
  display: inherit;
}

.__enum > .__show > label {
  display: inherit;
}

.__noBreak{
  white-space: nowrap;
}

.__bold {
  font-weight: bold;
}

.__textarea {
  outline: none;
  background-color: #e6e6e6;
  width: 100%;
  border: none;
  resize: vertical;
  overflow: hidden;
  border-radius: 0.2rem;
}
</style>
