<template>
  <div class="__documents">
    <div v-for="d in documents" :key="`doc${d.uid}`"
      class="__item"
      :class="{__active: isActive(d.uid)}"
      @click.stop="openDocument(d.uid)"
    >{{ d.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Documents',
  props: {
    folder: {
      type: Object,
      default: null
    }
  },
  computed: {
    activeDocument: function () {
      return this.$store.state.activeDocument
    },
    documents: function () {
      return this.$store.state.documents.filter(x => x.folderId === this.folder.uid)
    }
  },
  methods: {
    isActive (documentId) {
      return this.activeDocument && this.activeDocument.uid === documentId
    },
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
  padding-left: 3rem;
  color: white;
  line-height: 2rem;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: bold;
}

.__item:hover{
  background-color: #2970b6;
}

.__item.__active {
  background-color: #2970b6;
}
</style>
