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
  position: absolute;
  text-align: left;
  left: 4rem;
  padding: 1rem;
  width: 20rem;
  height: 100vh;
  color: white;
  background-color: #424242;
}
</style>
