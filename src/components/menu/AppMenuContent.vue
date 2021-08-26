<template>
  <div class="__appMenuContent">
    <div class="__heading">
      {{ heading }}
    </div>
    <Projects v-if="showProjects" />
    <Content
      v-if="showContent"
      :active-document="activeDocument"
    />
  </div>
</template>

<script>
import Projects from '@/components/menu/content/Projects'
import Content from '@/components/menu/content/Content'
import MenuItem from '@/constants/MenuItem'

export default {
  name: 'AppMenuContent',
  components: {
    Projects,
    Content
  },
  computed: {
    heading: function () {
      return this.$store.getMenuItem(this.activeMenuContent).name
    },
    activeDocument: function () {
      return this.$store.state.activeDocument
    },
    activeMenuContent: function () {
      return this.$store.state.activeMenuContent
    },
    showProjects: function () {
      return this.activeMenuContent === MenuItem.PROJECTS
    },
    showContent: function () {
      return this.activeDocument && this.activeMenuContent === MenuItem.CONTENT
    }
  }
}
</script>

<style scoped>
.__appMenuContent {
  width: 20rem;
  color: var(--text-light1);
  background-color: var(--bg-dark4);
}

.__heading {
  padding: 1rem;
  text-transform: uppercase;
}
</style>
