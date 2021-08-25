<template>
  <span>{{ object[name] }}</span>
</template>

<script>
export default {
  name: 'NumberField',
  props: {
    object: {
      type: Object,
      default: null
    },
    name: {
      type: String,
      default: ''
    }
  }
}
</script>
