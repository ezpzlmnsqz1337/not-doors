<template>
  <div
    v-for="(v, index) in values"
    :key="`enum-${v}${index}${object[name]}`"
    class="__noBreak"
  >
    <input
      :id="`${object.uid}${index}`"
      :type="multiple ? 'checkbox' : 'radio'"
      :name="`${object.uid}`"
      :checked="object[name].includes(v)"
      :value="v"
      @input="setEnumValue"
      @click.stop
    >
    <label :for="`${object.uid}${index}`">{{ v }}</label>
  </div>
</template>

<script>
export default {
  name: 'EnumField',
  props: {
    object: {
      type: Object,
      default: null
    },
    name: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    values: {
      type: Array,
      default: () => []
    }
  },
  methods: {
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
</style>
