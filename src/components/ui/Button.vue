<template>
  <button>
    <slot />
  </button>
</template>

<script>
import ButtonType from '@/constants/ButtonType'

export default {
  name: 'Button',
  props: {
    type: {
      type: ButtonType,
      default: null
    }
  },
  emits: ['click'],
  data: function () {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style scoped>
button {
  border: none;
  background-color: var(--text-light2);
  transition: transform background-color 0.1s;
  transform: scale(1,1);
  margin: 0.1rem;
  padding: 0.5rem 0.8rem;
  border-radius: 0.3rem;
  color: var(--text-light1);
}

button:hover {
  transform: scale(1.2,1.2);
  background-color: var(--text-light2);
  cursor: pointer;
}
</style>
