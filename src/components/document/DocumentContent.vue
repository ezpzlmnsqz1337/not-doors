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
              @mousedown="startResize($event, c)"
            />
          </th>
        </tr>
        <draggable
          :model-value="objects"
          tag="transition-group"
          :component-data="{name:'flip-list'}"
          v-bind="dragOptions"
          item-key="uid"
          @start="dragStart($event)"
          @end="dragEnd($event)"
        >
          <template #item="{element:o}">
            <tr
              class="__row"
              :class="{__active: activeObject && activeObject.uid === o.uid, __hover: hoverObject && hoverObject.uid === o.uid}"
              @click="handleRowClick(o)"
              @contextmenu.prevent="handleRowContextMenu($event, o, true)"
              @mouseover="setHoverObject({object: o})"
              @mouseout="setHoverObject({object: null})"
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
          </template>
        </draggable>
      </table>
      <button
        v-if="!objects.length"
        class="__add"
        @click.prevent="addFirstObjectToDocument({documentId: activeDocument.uid})"
      >
        +
      </button>
    </div>
  </PerfectScrollbar>
  <ObjectActions
    ref="actions"
    :object="activeObject"
    @hide="hideActions()"
  />
</template>

<script>
import Field from '@/components/document/Field'
import ObjectActions from '@/components/document/ObjectActions'
import { mapGetters, mapMutations, mapState } from 'vuex'
import draggable from 'vuedraggable'

export default {
  name: 'DocumentsContent',
  components: {
    Field,
    ObjectActions,
    draggable
  },
  data: function () {
    return {
      resizing: null,
      startX: 0,
      startWidth: 0,
      draggedElement: null
    }
  },
  computed: {
    ...mapState(['activeObject', 'activeDocument', 'columns', 'hoverObject']),
    ...mapGetters(['getSortedObjects', 'getDocumentObjects']),
    objects: function () {
      this.calculateChapters({ document: this.activeDocument })
      return this.getSortedObjects(this.activeDocument.uid)
    },
    dragOptions () {
      return {
        animation: 200,
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  mounted: function () {
    document.addEventListener('mousemove', e => {
      if (this.resizing) {
        this.setColumnWidth({ column: this.resizing, width: this.startWidth + (e.pageX - this.startX) })
      }
    })
    document.addEventListener('mouseup', () => this.stopResize())
    document.addEventListener('click', () => this.hideActions())
  },
  methods: {
    ...mapMutations(['calculateChapters', 'addFirstObjectToDocument', 'setActiveObject', 'setHoverObject', 'setColumnWidth', 'updateObjectsOrder', 'moveObjectAfter', 'moveObjectBelow']),
    dragStart ({ oldIndex }) {
      this.draggedElement = this.objects.at(oldIndex - 1)
    },
    dragEnd ({ oldIndex, newIndex }) {
      if (oldIndex === newIndex) return
      const id = oldIndex < newIndex ? 1 : 2
      const object = this.draggedElement
      const parent = this.objects.at(newIndex - id)
      if (parent.isHeading) {
        this.moveObjectBelow({ below: parent, object })
      } else {
        this.moveObjectAfter({ after: parent, object })
      }
    },
    startResize (e, column) {
      this.startX = e.pageX
      this.resizing = column
      this.startWidth = column.width
    },
    stopResize () {
      this.resizing = null
    },
    handleRowClick (object) {
      this.setActiveObject({ object })
      this.hideActions()
    },
    handleRowContextMenu (e, object, show) {
      this.setActiveObject({ object })
      this.showActions(e)
    },
    showActions (e) {
      const { clientX: x, clientY: y } = e
      const { offsetWidth: w, offsetHeight: h } = this.$refs.actions.$el
      const { innerWidth: wv, innerHeight: wh } = window
      this.$refs.actions.$el.style.transform = 'rotateX(0deg)'
      this.$refs.actions.$el.style.left = `${x + w > wv ? x - w : x}px`
      this.$refs.actions.$el.style.top = `${y + h > wh ? y - h : y}px`
    },
    hideActions () {
      this.$refs.actions.$el.style.transform = 'rotateX(90deg)'
      setTimeout(() => {
        this.$refs.actions.$el.style.left = '-100vw'
        this.$refs.actions.$el.style.top = '-100vh'
      }, 200)
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

tr.__row.__hover {
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
