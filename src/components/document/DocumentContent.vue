<template>
  <PerfectScrollbar class="__scroll">
    <div
      class="__documentContent"
      @mouseout="setHoverObject({object: null})"
    >
      <table
        v-if="objects.length > 0"
        class="__table"
      >
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
              :class="{__active: activeObject === o.uid, __hover: hoverObject === o.uid}"
              @click.stop="handleRowClick(o)"
              @contextmenu.prevent="handleRowContextMenu($event, o, true)"
              @mouseover="setHoverObject({ object: o })"
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
      <EmptyDocument
        v-if="objects.length === 0"
        :active-document="activeDocument"
      />
    </div>
  </PerfectScrollbar>
  <ObjectActions
    ref="actions"
    :object="getActiveObject()"
    @hide="hideActions()"
  />
</template>

<script>
import Field from '@/components/document/Field'
import ObjectActions from '@/components/document/ObjectActions'
import resize from '@/mixins/resize'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import draggable from 'vuedraggable'
import EmptyDocument from '../documents/EmptyDocument'

export default {
  name: 'DocumentsContent',
  components: {
    Field,
    EmptyDocument,
    ObjectActions,
    draggable
  },
  mixins: [resize],
  data: function () {
    return {
      draggedElement: null
    }
  },
  computed: {
    ...mapState('documents', ['activeDocument']),
    ...mapState('objects', ['activeObject', 'hoverObject']),
    ...mapGetters('documents', ['getSortedObjects', 'getDocumentObjects', 'getActiveDocument', 'getRootObject']),
    ...mapGetters('objects', ['getObjectById', 'getActiveObject']),
    ...mapState('columns', ['columns']),
    objects: function () {
      return this.getSortedObjects(this.activeDocument)
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
    document.addEventListener('click', () => {
      this.hideActions()
      this.setActiveObject({ object: null })
    })
  },
  methods: {
    ...mapActions('documents', ['calculateChapters']),
    ...mapMutations('objects', ['setActiveObject', 'setHoverObject', 'moveObjectAfter', 'moveObjectBelow']),
    ...mapMutations('columns', ['setColumnWidth']),
    dragStart ({ oldIndex }) {
      this.draggedElement = this.objects.at(oldIndex - 1)
    },
    dragEnd ({ oldIndex, newIndex }) {
      if (oldIndex === newIndex) return
      const id = oldIndex < newIndex ? 1 : 2
      const object = this.draggedElement
      const parent = this.objects.at(newIndex - id)
      if (newIndex === 1) {
        this.moveObjectBelow({ below: this.getRootObject(this.activeDocument), object })
      } else if (parent.isHeading) {
        this.moveObjectBelow({ below: parent, object })
      } else {
        this.moveObjectAfter({ after: parent, object })
      }
      this.calculateChapters({ document: this.getActiveDocument() })
    },
    startResize (e, column) {
      this.startX = e.pageX
      this.resizing = column
      this.startWidth = column.width
    },
    resizeHandler (element, newWidth) {
      this.setColumnWidth({ column: element, width: newWidth })
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
      if (!this.$refs.actions) return
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
  min-width: 100%;
  min-height: 100%;
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
