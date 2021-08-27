<template>
  <div class="__documents">
    <div
      v-for="d in getFolderDocuments(folder.uid)"
      :key="`doc${d.uid}`"
      class="__item"
      :class="{__active: isActive(d.uid)}"
      @click.stop="openDocument({document: d})"
    >
      {{ d.name }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
export default {
  name: 'Documents',
  props: {
    folder: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapState(['activeDocument']),
    ...mapGetters(['getFolderDocuments'])
  },
  methods: {
    ...mapMutations(['openDocument']),
    isActive (documentId) {
      return this.activeDocument && this.activeDocument.uid === documentId
    }
  }
}
</script>

<style scoped>
.__documents {

}

.__item {
  padding-left: 3rem;
  color: var(--text-light1);
  line-height: 2rem;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: bold;
}

.__item:hover{
  background-color: var(--hover);
}

.__item.__active {
  background-color: var(--hover);
}
</style>
