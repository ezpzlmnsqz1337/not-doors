<template>
  <div class="__appMenuContent">
    <Projects v-if="selected === 'projects'"/>
  </div>
</template>

<script>
import Projects from '@/components/projects/Projects'

export default {
  name: 'AppMenuContent',
  components: {
    Projects
  },
  data: function () {
    return {
      selected: 'projects'
    }
  }
}
</script>

<style scoped>
.__appMenuContent {
  width: 20rem;
  color: white;
  background-color: #424242;
}
</style>
