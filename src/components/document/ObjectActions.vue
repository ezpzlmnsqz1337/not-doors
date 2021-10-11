<template>
  <div
    class="__actions"
  >
    <div class="__heading">
      Actions
    </div>
    <Button
      :type="ButtonType.SUCCESS"
      title="Add object"
      @click="addObjectAfter()"
    >
      <span class="material-icons-outlined __icon">add_box</span>
    </Button>
    <Button
      v-if="object && object.isHeading"
      :type="ButtonType.SECONDARY"
      title="Add object below"
      @click="addObjectBelow()"
    >
      <span class="material-icons-outlined __icon">library_add</span>
    </Button>
    <Button
      v-if="object && getDocumentObjects(object.documentId).length > 1"
      :type="ButtonType.PRIMARY"
      title="Toggle heading"
      @click="toggleObjectTitle()"
    >
      <span class="material-icons-outlined __icon">title</span>
    </Button>
    <Button
      :type="ButtonType.DANGER"
      title="Remove object"
      @click="deleteObject()"
    >
      <span class="material-icons-outlined __icon">delete</span>
    </Button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ObjectActions',
  props: {
    object: {
      type: Object,
      default: null
    }
  },
  emits: ['hide'],
  computed: {
    ...mapGetters('documents', ['getDocumentObjects', 'getActiveDocument'])
  },
  methods: {
    ...mapActions('documents', ['calculateChapters']),
    ...mapActions('objects', { addAfter: 'addObjectAfter', addBelow: 'addObjectBelow', ro: 'removeObject', tot: 'toggleObjectTitle' }),
    getActions: function () {
      return this.actions.filter(x => x.condition())
    },
    addObjectAfter: async function () {
      await this.addAfter({
        after: this.object,
        object: {}
      })
      this.calculateChapters({ document: this.getActiveDocument() })
      this.$emit('hide')
    },
    addObjectBelow: async function () {
      await this.addBelow({
        parent: this.object,
        object: {}
      })
      this.calculateChapters({ document: this.getActiveDocument() })
      this.$emit('hide')
    },
    toggleObjectTitle: async function () {
      await this.tot({ object: this.object })
      this.calculateChapters({ document: this.getActiveDocument() })
    },
    deleteObject: async function () {
      await this.ro({ object: this.object })
      this.calculateChapters({ document: this.getActiveDocument() })
      this.$emit('hide')
    }
  }
}
</script>

<style scoped>
.__actions {
  padding: 0.5rem;
  background-color: var(--bg-dark3);
  border: 1px solid var(--border-dark1);
  border-radius: 0.2rem;
  position: fixed;
  left: -100vw;
  top: -100vh;
  transform: rotateX(90deg);
  transition: transform 0.2s;
}

.__heading {
  padding-bottom: 0.2rem;
  margin-bottom: 0.3rem;
  font-size: 0.8rem;
  border-bottom: 1px solid var(--border-light1);
}

.__icon {
  font-size: 1.2rem;
}
</style>
