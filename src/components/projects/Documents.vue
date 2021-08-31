<template>
  <div class="__documents">
    <div
      v-for="d in getDocuments(folder.uid)"
      :key="`doc${d.uid}`"
      class="__item"
      :style="`padding-left: ${level}rem`"
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
    },
    level: {
      type: Number,
      default: 3
    }
  },
  computed: {
    ...mapState('documents', ['activeDocument']),
    ...mapGetters('documents', ['getDocuments'])
  },
  methods: {
    ...mapMutations('documents', ['openDocument']),
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
