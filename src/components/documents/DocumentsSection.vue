<template>
  <div class="__documentsSection">
    <div v-if="!areOpenDocuments" class="__placeholder">No open documents</div>
    <DocumentsHeader v-if="areOpenDocuments" />
    <DocumentsContent v-if="areOpenDocuments" />
  </div>
</template>

<script>
import DocumentsHeader from '@/components/documents/DocumentsHeader'
import DocumentsContent from '@/components/documents/DocumentsContent'

export default {
  name: 'DocumentsSection',
  components: {
    DocumentsHeader,
    DocumentsContent
  },
  data: function () {
    return {
      openDocuments: this.$store.state.openDocuments,
      activeDocument: this.$store.state.activeDocument
    }
  },
  computed: {
    areOpenDocuments: function () {
      return this.openDocuments.length > 0
    }
  }
}
</script>

<style scoped>
.__documentsSection {
  flex: 1;
  background-color: #242424;
}

.__placeholder {
  width: 100%;
  height: 100%;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: gray;
}
</style>
