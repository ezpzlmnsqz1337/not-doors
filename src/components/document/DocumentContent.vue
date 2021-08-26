<template>
  <PerfectScrollbar class="__scroll">
    <div class="__documentContent">
      <table class="__table">
        <tr>
          <th
            v-for="c in columns"
            :key="c.name"
            class="__header"
            :width="`${c.width}px`"
          >
            <span>{{ c.displayName }}</span>
            <div
              class="__resize"
              @mousedown="startResize($event, c.uid)"
            />
          </th>
        </tr>
        <tr
          v-for="o in objects"
          :key="`object${o.uid}`"
          class="__row"
          :class="{__active: activeObject && activeObject.uid === o.uid}"
          @click="handleRowClick($event, o)"
          @contextmenu.prevent="showActions($event, true)"
        >
          <td
            v-for="c in columns"
            :key="o.name + c.name"
            class="__column"
          >
            <Field
              :object="o"
              :column="c"
            />
          </td>
        </tr>
      </table>
      <button
        class="__add"
        @click.prevent="addObject()"
      >
        +
      </button>
    </div>
  </PerfectScrollbar>
  <ObjectActions
    v-show="actions"
    ref="actions"
    :object="activeObject"
  />
</template>

<script>
import Field from '@/components/document/Field'
import ObjectActions from '@/components/document/ObjectActions'

export default {
  name: 'DocumentsContent',
  components: {
    Field,
    ObjectActions
  },
  data: function () {
    return {
      resizing: null,
      startX: 0,
      startWidth: 0,
      actions: false
    }
  },
  computed: {
    activeObject: function () {
      return this.$store.state.activeObject
    },
    activeDocument: function () {
      this.$store.calculateChapters(this.$store.state.activeDocument.uid)
      return this.$store.state.activeDocument
    },
    columns: function () {
      return this.$store.state.columns
    },
    objects: function () {
      return this.$store.state.objects.filter(x => x.documentId === this.activeDocument.uid)
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
    handleRowClick (e, object) {
      this.setActiveObject(object)
      this.showActions(e, false)
    },
    setActiveObject (object) {
      this.$store.setActiveObject(object)
    },
    showActions ({ clientX: x, clientY: y }, show) {
      this.actions = show
      if (!show) return
      const { offsetWidth: w, offsetHeight: h } = this.$refs.actions.$el
      const { innerWidth: wv, innerHeight: wh } = window
      this.$refs.actions.$el.style.left = `${x + w > wv ? x - w : x}px`
      this.$refs.actions.$el.style.top = `${y + h > wh ? y - h : y}px`
    }
  }
}
</script>

<style scoped>
.__documentContent {
  position: absolute;
  margin-bottom: 5rem;
}

.__table {
  width: max-content;
}

tr.__row {
  background-color: var(--bg-dark1);
}

tr.__row:hover {
  background-color: var(--hover);
}

tr.__row.__active {
  background-color: var(--active);
}

.__header {
  text-align: left;
  border-bottom: 2px solid gray;
  border-right: 1px solid gray;
}

.__header:hover {
  background-color: var(--hover);
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

.__scroll {
  height: 100%;
  overflow: scroll;
}
</style>
