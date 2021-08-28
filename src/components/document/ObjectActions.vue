<template>
  <div
    class="__actions"
    @click.stop
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
      @click="toggleObjectTitle({object})"
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
import Button from '@/components/ui/Button'
import ButtonType from '@/constants/ButtonType'
import { mapGetters, mapMutations } from 'vuex'

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
      ButtonType
    }
  },
  computed: {
    ...mapGetters(['getDocumentObjects'])
  },
  methods: {
    ...mapMutations(['toggleObjectTitle']),
    ...mapMutations({ addAfter: 'addObjectAfter', addBelow: 'addObjectBelow', ro: 'removeObject' }),
    getActions: function () {
      return this.actions.filter(x => x.condition())
    },
    addObjectAfter: function () {
      this.addAfter({
        object: this.object,
        newObject: {
          type: 'PROSE',
          text: 'Object text'
        }
      })
      this.$emit('hide')
    },
    addObjectBelow: function () {
      this.addBelow({
        object: this.object,
        newObject: {
          type: 'PROSE',
          text: 'Object below text'
        }
      })
      this.$emit('hide')
    },
    deleteObject: function () {
      this.ro({ object: this.object })
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
