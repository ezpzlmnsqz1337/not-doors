<template>
  <div class="__createModalTemplate">
    <div class="__heading">
      Create document template
    </div>
    <label for="templateName">Name</label>
    <input
      id="templateName"
      v-model="name"
      type="text"
    >
    <label for="templateDescription">Description</label>
    <input
      id="templateDescription"
      v-model="description"
      type="text"
    >
    <div class="__buttons">
      <Button
        type="danger"
        @click="$emit('hide')"
      >
        Cancel
      </Button>
      <Button
        type="primary"
        @click="create()"
      >
        Create
      </Button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'CreateDocumentTemplate',
  props: {
    activeDocument: {
      type: String,
      default: null
    }
  },
  emits: ['hide'],
  data: function () {
    return {
      name: 'New template',
      description: 'Description'
    }
  },
  methods: {
    ...mapActions('templates', ['createTemplate']),
    create () {
      this.createTemplate({
        name: this.name,
        description: this.description,
        documentId: this.activeDocument
      })
      this.name = 'New template'
      this.description = 'Description'
      this.$emit('hide')
    }
  }
}
</script>

<style scoped>
.__createModalTemplate {
  display: flex;
  flex-direction: column;
}

.__heading {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.__createModalTemplate label {
  margin-bottom: 0.2rem;
}

.__createModalTemplate input {
  margin-bottom: 1rem;
}

.__createModalTemplate .__buttons {
  display: flex;
}

.__createModalTemplate .__buttons button {
  flex: 1;
}
</style>
