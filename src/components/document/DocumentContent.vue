<template>
  <div class="__documentContent">
    <table class="__table">
      <tr>
        <th v-for="c in columns" :key="c.name" class="__header" >{{ c.displayName }}</th>
      </tr>
      <tr v-for="o in objects" :key="`object${o.id}`">
        <td v-for="c in columns" :key="o.name + c.name" class="__column">
          <Field :object="o" :column="c" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import Field from '@/components/document/Field'

export default {
  name: 'DocumentsContent',
  components: {
    Field
  },
  computed: {
    activeDocument: function () {
      return this.$store.state.activeDocument
    },
    columns: function () {
      return this.$store.state.columns.filter(x => this.activeDocument.columns.includes(x.uid))
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
  flex-direction: row;
}

.__table {
  flex: 1;
}

.__column {
  background-color: #8b8b8b;
  cursor: pointer;
}

.__column:hover {
  background-color: #2970b6;
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
