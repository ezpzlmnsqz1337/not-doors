<template>
  <div class="__content">
    <div class="__heading">
      {{ activeDocument.name }}
    </div>
    <template
      v-for="o in objects"
      :key="`object${o.uid}`"
    >
      <div
        class="__item"
        :class="{__active: activeObject === o.uid, __hover: hoverObject === o.uid}"
        @click="setActiveObject({object: o})"
        @mouseenter="setHoverObject({object: o})"
        @mouseout="setHoverObject({object: null})"
      >
        {{ getItem(o) }}
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'

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
    ...mapState(['activeObject', 'hoverObject']),
    objects: function () {
      return this.getSortedObjects(this.activeDocument.uid).filter(x => !this.onlyHeadings || x.isHeading)
    }
  },
  methods: {
    ...mapMutations(['setActiveObject', 'setHoverObject']),
    clickBro: function (object) {
      console.log('CLICK')
      this.setActiveObject({ object })
    },
    getItem ({ chapter, text, parentId, isHeading }) {
      if (isHeading && chapter) return `${chapter}. ${text}`
      const parent = this.getObjectById(parentId)
      if (parent.name === 'root') return `${text}`
      return parent.chapter.split('').reduce(acc => acc + '-', '') + ` ${text}`
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
  display: flex;
}

.__item:hover {
  cursor: pointer;
  background-color: var(--hover);
}

.__item.__hover {
  background-color: var(--hover);
}

.__item.__active {
  background-color: var(--active);
}
</style>
