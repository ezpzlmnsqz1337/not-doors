<template>
  <div class="__documentsHeader">
    <div v-for="d in openDocuments" :key="`ad${d.uid}`" class="__item" :class="{__active: activeDocument && d.uid === activeDocument.uid}" @click="openDocument(d.uid)" >
      <span>{{ d.name }}</span>
      <span class="__close" @click.stop="closeDocument(d.uid)">×</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'DocumentsHeader',
  data: function () {
    return {
      openDocuments: this.$store.state.openDocuments,
      activeDocument: this.$store.state.activeDocument
    }
  },
  methods: {
    closeDocument (documentId) {
      this.$store.closeDocument(documentId)
    },
    openDocument (documentId) {
      this.$store.openDocument(documentId)
    }
  }
}
</script>

<style scoped>
.__documentsHeader {
  height: 2rem;
  background-color: #424141;
}

.__item:first-child{
  border-left: none
}

.__item {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-left: 1px solid black;
  display: inline-block;
  line-height: 2rem;
  background-color: gray;
  color: white;
  cursor: pointer;
}

.__item:hover, .__item.__active:hover {
  background-color: #2970b6;
}

.__item.__active {
  background-color: #242424;
}

.__item:hover .__close, .__item.__active .__close{
  opacity: 1;
}

.__close {
  opacity: 0;
  display: inline-block;
  margin-left: 0.5rem;
  font-size: 1.5rem;
  line-height: 1rem;
  vertical-align: text-bottom;
}

.__close:hover {
  background-color: gray;
  border-radius: 0.2rem;
}
</style>
