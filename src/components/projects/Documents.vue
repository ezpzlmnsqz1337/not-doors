<template>
  <div class="__documents">
    <div class="__item" v-for="d in documents" :key="`doc${d.uid}`" @click.stop="openDocument(d.uid)">
      {{d.name}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Folders',
  props: {
    folder: {
      type: Object,
      default: null
    }
  },
  data: function () {
    return {
      documents: this.$store.state.documents.filter(x => x.folderId === this.folder.uid && x.projectId === this.folder.projectId)
    }
  },
  methods: {
    openDocument: function (documentId) {
      this.$store.openDocument(documentId)
    }
  }
}
</script>

<style scoped>
.__documents {

}

.__item {
  padding-left: 2rem;
  color: white;
  line-height: 2rem;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: bold;
}

.__item:hover{
  background-color: #2970b6;
}
</style>
