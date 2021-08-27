<template>
  <div class="__documentsHeader">
    <div
      v-for="d in openDocuments"
      :key="`ad${d.uid}`"
      class="__item"
      :class="{__active: activeDocument && d.uid === activeDocument.uid}"
      @click="openDocument({document: d})"
    >
      <span>{{ d.name }}</span>
      <span
        class="__close"
        @click.stop="closeDocument({document: d})"
      >×</span>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'DocumentsHeader',
  computed: {
    ...mapState(['openDocuments', 'activeDocument'])
  },
  methods: {
    ...mapMutations(['closeDocument', 'openDocument'])
  }
}
</script>

<style scoped>
.__documentsHeader {
  height: 2rem;
  background-color: var(--bg-dark3);
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
  background-color: var(--text-light2);
  color: var(--text-light1);
  cursor: pointer;
}

.__item:hover, .__item.__active:hover {
  background-color: var(--hover);
}

.__item.__active {
  background-color: var(--bg-dark5);
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
  background-color: var(--text-light2);
  border-radius: 0.2rem;
}
</style>
