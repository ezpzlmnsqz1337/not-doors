<template>
  <div
    class="__actions"
  >
    <div>Actions</div>
    <Button>add</Button>
    <Button>add below</Button>
    <Button>remove</Button>
  </div>
</template>

<script>
import Button from '@/components/ui/Button'

export default {
  name: 'Field',
  components: {
    Button
  },
  props: {
    object: {
      type: Object,
      default: null
    }
  }
}
</script>

<style scoped>
.__actions {
  padding: 0.5rem;
  background-color: var(--bg-dark3);
  border: 1px solid #424141;
  border-radius: 0.2rem;
  position: fixed;
}
</style>
