<template>
  <div
    ref="enum"
    class="__wrapper"
    @click.stop="showValues = true"
  >
    <div
      class="__normal"
    >
      <div
        v-for="(s, index) in selected"
        :key="`selected-${s}${index}${object[name]}`"
        class="__noBreak"
      >
        {{ s }}<div />
      </div>
      <div
        v-if="showValues"
        class="__hover"
      >
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
      </div>
    </div>
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
  data: function () {
    return {
      showValues: false
    }
  },
  computed: {
    ...mapGetters(['getObjectById']),
    selected: function () {
      return this.values.filter(x => this.object[this.name].includes(x))
    }
  },
  created: function () {
    document.addEventListener('click', e => (this.showValues = false))
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
.__wrapper {
  min-height: 1rem;
}

.__noBreak{
  white-space: nowrap;
}

.__hover {
  position: absolute;
  padding: 0.8rem;
  background-color: var(--bg-dark2);
  border-radius: 0.3rem;
}
</style>
