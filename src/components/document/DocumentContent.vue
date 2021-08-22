<template>
  <div class="__documentContent">
    <table class="__table">
      <tr>
        <th v-for="c in columns" :key="c.name" class="__header" >{{ c.displayName }}</th>
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
  methods: {
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
  display: flex;
  flex-direction: column;
}

.__table {
  flex: 1;
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
</style>
