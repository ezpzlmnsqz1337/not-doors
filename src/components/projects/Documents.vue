<template>
  <div class="__documents">
    <CategoryListItems :options="options" />
  </div>
</template>

<script>
import CategoryListItems from '@/components/CategoryListItems'
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  name: 'Documents',
  components: {
    CategoryListItems
  },
  props: {
    folder: {
      type: Object,
      default: null
    },
    level: {
      type: Number,
      default: 3
    }
  },
  computed: {
    ...mapState('documents', ['activeDocument']),
    ...mapGetters('documents', ['getDocuments']),
    options: function () {
      return {
        categories: this.getDocuments(this.folder.uid),
        category: {
          key: 'document',
          isActive: this.isActive,
          onToggle: this.openDocument,
          onRename: this.renameDocument,
          onRemove: this.removeDocument,
          icon: 'description'
        },
        level: this.level
      }
    }
  },
  methods: {
    ...mapMutations('documents', ['openDocument', 'renameDocument', 'removeDocument']),
    isActive (documentId) {
      return this.activeDocument === documentId
    }
  }
}
</script>

<style scoped>
.__documents {

}

.__item {
  display: flex;
  color: var(--text-light1);
  line-height: 2rem;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: bold;
}

.__item > .material-icons{
  line-height: 2rem;
  font-size: 1rem;
  margin-right: 0.3rem;
}

.__item:hover{
  background-color: var(--hover);
}
</style>
