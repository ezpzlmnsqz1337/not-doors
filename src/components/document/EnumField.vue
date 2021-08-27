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
import { mapGetters, mapMutations } from 'vuex'
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
  computed: {
    ...mapGetters(['getObjectById'])
  },
  methods: {
    ...mapMutations(['setObjectProperty']),
    setEnumValue (e) {
      const object = this.getObjectById(this.object.uid)
      let values = [...object[this.name]]
      if (this.multiple) {
        const index = values.findIndex(x => x === e.target.value)
        if (index !== -1) {
          values.splice(index, 1)
        } else {
          values.push(e.target.value)
        }
      } else {
        values = e.target.value
      }
      this.setObjectProperty({ object, key: this.name, value: values })
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
