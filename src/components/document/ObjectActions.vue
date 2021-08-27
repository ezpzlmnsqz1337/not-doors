<template>
  <div
    class="__actions"
  >
    <div class="__heading">
      Actions
    </div>
    <Button
      v-for="(a, index) in getActions()"
      :key="`action${index}`"
      :type="a.type"
      :title="a.title"
      @click="a.click"
    >
      <span class="material-icons-outlined __icon">{{ a.icon }}</span>
    </Button>
  </div>
</template>

<script>
import Button from '@/components/ui/Button'
import ButtonType from '@/constants/ButtonType'

export default {
  name: 'Field',
  components: {
    Button
  },
  props: {
    object: {
      type: Object,
      default: null
    }
  },
  emits: ['hide'],
  data: function () {
    return {
      ButtonType,
      actions: [
        { type: ButtonType.SUCCESS, title: 'Add object', icon: 'add_box', click: this.addObject, condition: () => true },
        { type: ButtonType.SECONDARY, title: 'Add object below', icon: 'library_add', click: this.addObjectBelow, condition: () => this.object && this.object.isHeading },
        { type: ButtonType.PRIMARY, title: 'Toggle heading', icon: 'title', click: this.toggleTitle, condition: () => this.object && this.$store.getDocumentObjects(this.object.documentId).length > 1 },
        { type: ButtonType.DANGER, title: 'Remove object', icon: 'delete', click: this.delete, condition: () => true }
      ]
    }
  },
  methods: {
    getActions: function () {
      return this.actions.filter(x => x.condition())
    },
    addObject: function () {
      this.$store.addObjectAfter(this.object.uid, {
        type: 'PROSE',
        text: 'Object text'
      })
      this.$emit('hide')
    },
    addObjectBelow: function () {
      this.$store.addObjectBelow(this.object.uid, {
        type: 'PROSE',
        text: 'Object below text'
      })
      this.$emit('hide')
    },
    toggleTitle: function () {
      this.$store.getObjectById(this.object.uid).isHeading = !this.object.isHeading
    },
    delete: function () {
      this.$store.removeObject(this.object.uid)
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
