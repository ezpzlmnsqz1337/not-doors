<template>
  <div class="__documentContent">
    <table class="__table">
      <tr>
        <th v-for="c in columns" :key="c.name" class="__header" :width="`${c.width}px`">
          <span>{{ c.displayName }}</span>
          <div class="__resize" @mousedown="startResize($event, c.uid)" />
        </th>
      </tr>
      <tr v-for="o in objects"
        :key="`object${o.uid}`"
        class="__row"
        :class="{__active: activeObject && activeObject.uid === o.uid}"
        @click="setActiveObject(o)"
      >
        <td v-for="c in columns" :key="o.name + c.name" class="__column">
          <Field :object="o" :column="c" />
        </td>
      </tr>
    </table>
    <button class="__add" @click.prevent="addObject()">+</button>
  </div>
</template>

<script>
import Field from '@/components/document/Field'

export default {
  name: 'DocumentsContent',
  components: {
    Field
  },
  data: function () {
    return {
      resizing: null,
      startX: 0,
      startWidth: 0
    }
  },
  mounted: function () {
    document.addEventListener('mousemove', e => {
      if (this.resizing) {
        this.resizing.width = this.startWidth + (e.pageX - this.startX)
      }
    })
    document.addEventListener('mouseup', () => this.stopResize())
  },
  methods: {
    startResize (e, columnId) {
      this.startX = e.pageX
      this.resizing = this.$store.findColumn(columnId)
      this.startWidth = this.resizing.width
    },
    stopResize () {
      this.resizing = null
    },
    addObject () {
      this.$store.addObjectToDocument(this.activeDocument.uid, {
        order: 4,
        type: 'PROSE',
        text: 'Dummy text',
        classification: [],
        isHeading: false,
        chapter: 0,
        parentId: 0
      })
    },
    setActiveObject (object) {
      this.$store.setActiveObject(object)
    }
  },
  computed: {
    activeObject: function () {
      return this.$store.state.activeObject
    },
    activeDocument: function () {
      return this.$store.state.activeDocument
    },
    columns: function () {
      return this.$store.state.columns
    },
    objects: function () {
      return this.$store.state.objects.filter(x => x.documentId === this.activeDocument.uid)
    }
  }
}
</script>

<style scoped>
.__documentContent {
}

.__table {
  width: 100%;
}

.__column {
  cursor: pointer;
}

tr.__row {
  background-color: #8b8b8b;
}

tr.__row:hover {
  background-color: #2970b6;
}

tr.__row.__active {
  background-color: #205b95;
}

.__header {
  text-align: left;
  border-bottom: 2px solid gray;
  border-right: 1px solid gray;
}

.__header:hover {
  background-color: #2970b6;
  cursor: pointer;
}

.__bold {
  font-weight: bold;
}

.__resize {
  float: right;
  cursor: col-resize;
  width: 0.2rem;
  height: 1rem;
  background-color: green;
  user-select: none;
}

.__resize:hover {
  background-color: red;
}
</style>
