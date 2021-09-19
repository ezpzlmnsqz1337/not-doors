<template>
  <div
    ref="panel"
    class="__appMenuContent"
    :style="`width: ${panelWidth}px`"
  >
    <div
      class="__resize"
      @mousedown="handleResizeStart($event)"
    />
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
import resize from '@/mixins/resize'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'AppMenuContent',
  components: {
    Projects,
    Content
  },
  mixins: [resize],
  computed: {
    ...mapState('documents', ['activeDocument']),
    ...mapState(['activeMenuContent']),
    ...mapGetters('documents', ['getActiveDocument']),
    ...mapGetters('panels', ['getPanelByName']),
    ...mapGetters(['getMenuItemById']),
    heading: function () {
      return this.getMenuItemById(this.activeMenuContent).name
    },
    showProjects: function () {
      return this.activeMenuContent === MenuItem.PROJECTS
    },
    showContent: function () {
      return this.getActiveDocument() && this.activeMenuContent === MenuItem.CONTENT
    },
    panelWidth: function () {
      return this.getPanelByName('menu').width
    }
  },
  methods: {
    ...mapActions('panels', ['setPanelWidth']),
    handleResizeStart: function (e) {
      this.startResize(e, this.$refs.panel)
    },
    resizeHandler (element, newWidth) {
      this.setPanelWidth({ panelName: 'menu', width: newWidth })
    }
  }
}
</script>

<style scoped>
.__appMenuContent {
  color: var(--text-light1);
  background-color: var(--bg-dark4);
  position: relative;
}

.__heading {
  padding: 1rem;
  text-transform: uppercase;
}

.__resize {
  position: absolute;
  right: 0;
  width: 3px;
  height: 100%;
  user-select: none;
}

.__resize:hover {
  cursor: col-resize;
  background-color: var(--hover)
}
</style>
