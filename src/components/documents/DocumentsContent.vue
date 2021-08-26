<template>
  <div class="__documentsContent">
    <DocumentContent />
  </div>
</template>

<script>
import DocumentContent from '@/components/document/DocumentContent'

export default {
  name: 'DocumentsContent',
  components: {
    DocumentContent
  }
}
</script>

<style scoped>
.__documentsContent {
  background-color: var(--bg-dark5);
  position: relative;
  height: calc(100% - 2rem);
}
</style>
