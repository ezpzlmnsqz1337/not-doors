<template>
  <div class="__appContent">
    <AppMenu />
    <AppMenuContent v-if="activeMenuContent" />
    <DocumentsSection />
  </div>
</template>

<script>
import AppMenu from '@/components/menu/AppMenu'
import AppMenuContent from '@/components/menu/AppMenuContent'
import DocumentsSection from '@/components/documents/DocumentsSection'
import { mapState } from 'vuex'

export default {
  name: 'AppContent',
  components: {
    AppMenu,
    AppMenuContent,
    DocumentsSection
  },
  computed: {
    ...mapState(['activeMenuContent'])
  }
}
</script>

<style scoped>
.__appContent {
  position: absolute;
  height: calc(100vh - 2rem);
  width: 100%;
  display: flex;
}
</style>
