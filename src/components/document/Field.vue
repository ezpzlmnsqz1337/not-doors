<template>
  <div class="__field" @click.stop>
    <div v-if="column.type === 'string'" :class="{__bold: object.isHeading}">{{ parseText() }}</div>
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
        />
        <label :for="`${object.uid}${index}`">{{ v }}</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DocumentsContent',
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
  methods: {
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
</style>
