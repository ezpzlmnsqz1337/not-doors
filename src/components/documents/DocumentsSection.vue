<template>
  <div
    class="__documentsSection"
  >
    <div
      v-if="activeUser"
    >
      <div
        v-if="!areOpenDocuments"
        class="__placeholder"
      >
        No open documents
      </div>
      <DocumentsHeader v-if="areOpenDocuments" />
      <DocumentsContent v-if="areOpenDocuments" />
    </div>
  </div>
</template>

<script>
import DocumentsHeader from '@/components/documents/DocumentsHeader'
import DocumentsContent from '@/components/documents/DocumentsContent'
import { mapState } from 'vuex'

export default {
  name: 'DocumentsSection',
  components: {
    DocumentsHeader,
    DocumentsContent
  },
  computed: {
    ...mapState('users', ['activeUser']),
    ...mapState('documents', ['openDocuments']),
    areOpenDocuments: function () {
      return this.openDocuments.length > 0
    }
  }
}
</script>

<style scoped>
.__documentsSection {
  background-color: var(--bg-dark5);
  flex: 1;
}

.__documentsSection > div {
  width: 100%;
  height: 100%;
}

.__placeholder {
  width: 100%;
  height: 100%;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-light2);
}
</style>
