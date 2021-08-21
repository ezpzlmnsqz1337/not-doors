<template>
  <div class="__appContent">
    <AppMenu />
    <AppMenuContent />
    <DocumentsSection />
  </div>
</template>

<script>
import AppMenu from '@/components/menu/AppMenu'
import AppMenuContent from '@/components/menu/AppMenuContent'
import DocumentsSection from '@/components/documents/DocumentsSection'

export default {
  name: 'AppContent',
  components: {
    AppMenu,
    AppMenuContent,
    DocumentsSection
  }
}
</script>

<style scoped>
.__appContent {
  position: absolute;
  height: calc(100vh - 2rem);
  width: 100%;
}
</style>
