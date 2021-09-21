<template>
  <div class="__emptyDocument">
    <div class="__middleContent">
      <div class="__heading">
        Document is empty
      </div>
      <div class="__buttons">
        <Button
          type="secondary"
          @click="addFirstObjectToDocument({documentId: activeDocument})"
        >
          Add new object
        </Button>
        <Button
          type="primary"
          @click="showTemplates = true"
        >
          Use template
        </Button>
      </div>
    </div>
  </div>
  <Modal
    v-if="showTemplates"
    @close="showTemplates = false"
  >
    <template #body>
      <DocumentTemplates />
    </template>
  </Modal>
</template>

<script>
import DocumentTemplates from '@/components/documents/DocumentTemplates'
import { mapActions } from 'vuex'

export default {
  name: 'EmptyDocument',
  components: {
    DocumentTemplates
  },
  props: {
    activeDocument: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      showTemplates: false
    }
  },
  methods: {
    ...mapActions('objects', ['addFirstObjectToDocument'])
  }
}
</script>

<style scoped>
.__emptyDocument {
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
  align-items: center;
}

.__middleContent {
  max-width: 50%;
  margin: 0 auto;
  text-align: center;
}

.__heading {
  font-size: 1.5rem;
  color: var(--text-light2);
  margin-bottom: 2rem;
}

.__buttons button {
  width: 70%;
  margin-bottom: 0.5rem;
}
</style>
