<template>
  <div class="__appMenuContent">
    <div class="__heading">
      {{ heading }}
    </div>
    <Projects v-if="showProjects" />
    <Content
      v-if="showContent"
      :active-document="getActiveDocument()"
    />
  </div>
</template>

<script>
import Projects from '@/components/menu/content/Projects'
import Content from '@/components/menu/content/Content'
import MenuItem from '@/constants/MenuItem'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'AppMenuContent',
  components: {
    Projects,
    Content
  },
  computed: {
    ...mapState(['activeDocument', 'activeMenuContent']),
    ...mapGetters('documents', ['getActiveDocument']),
    ...mapGetters(['getMenuItemById']),
    heading: function () {
      return this.getMenuItemById(this.activeMenuContent).name
    },
    showProjects: function () {
      return this.activeMenuContent === MenuItem.PROJECTS
    },
    showContent: function () {
      return this.getActiveDocument() && this.activeMenuContent === MenuItem.CONTENT
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
