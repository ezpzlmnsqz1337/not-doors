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
  background-color: #242424;
  position: relative;
  height: calc(100% - 2rem);
  overflow: scroll;
}
</style>
