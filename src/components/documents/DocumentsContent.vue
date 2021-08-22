<template>
  <div class="__documentsContent">
    <DocumentHeader />
    <DocumentContent />
  </div>
</template>

<script>
import DocumentHeader from '@/components/document/DocumentHeader'
import DocumentContent from '@/components/document/DocumentContent'

export default {
  name: 'DocumentsContent',
  components: {
    DocumentHeader,
    DocumentContent
  }
}
</script>

<style scoped>
.__documentsContent {
  position: absolute;
  top: 2rem;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: #242424;
}
</style>
