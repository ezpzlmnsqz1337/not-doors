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
    ...mapState('objects', ['activeObject', 'hoverObject']),
    ...mapGetters('documents', ['getSortedObjects']),
    ...mapGetters('objects', ['getObjectById']),
    objects: function () {
      return this.getSortedObjects(this.activeDocument.uid).filter(x => !this.onlyHeadings || x.isHeading)
    }
  },
  methods: {
    ...mapMutations('objects', ['setActiveObject', 'setHoverObject']),
    getItem ({ chapter, text, parentId, isHeading }) {
      if (isHeading && chapter) return `${chapter}. ${this.stripTags(text)}`
      const parent = this.getObjectById(parentId)
      if (parent.root) return `${this.stripTags(text)}`
      return parent.chapter.split('').reduce(acc => acc + '-', '') + ` ${this.stripTags(text)}`
    },
    stripTags (text) {
      return text.replace(/(<([^>]+)>)/gi, '')
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
