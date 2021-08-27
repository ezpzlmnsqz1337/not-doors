<template>
  <div class="__content">
    <div class="__heading">
      {{ activeDocument.name }}
    </div>
    <div
      v-for="o in objects"
      :key="`object${o.uid}`"
      class="__item"
    >
      {{ getItem(o) }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Content',
  props: {
    activeDocument: {
      type: Object,
      default: null
    }
  },
  data: function () {
    return {
      onlyHeadings: false
    }
  },
  computed: {
    ...mapGetters(['getObjectById', 'getSortedObjects']),
    objects: function () {
      return this.getSortedObjects(this.activeDocument.uid).filter(x => !this.onlyHeadings || x.isHeading)
    }
  },
  methods: {
    getItem ({ chapter, text, parentId, isHeading }) {
      if (isHeading) return `${chapter}. ${text}`
      return this.getObjectById(parentId).chapter.split('')
        .reduce(acc => acc + '-', '') + ` ${text}`
    }
  }
}
</script>

<style scoped>
.__content {
}

.__heading {
  padding: 0.3rem 1rem;
}

.__item {
  padding: 0.3rem 1rem;
}

.__item:hover {
  cursor: pointer;
  background-color: var(--hover);
}
</style>
