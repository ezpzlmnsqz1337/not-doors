<template>
  <div class="__documentContent">
    <table class="__table">
      <tr>
        <th v-for="c in columns" :key="c.name" class="__header" >{{ c.displayName }}</th>
      </tr>
      <tr v-for="o in objects" :key="`object${o.id}`">
        <td v-for="c in columns" :key="o.name + c.name" class="__column">{{ o[c.name] }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'DocumentsContent',
  data: function () {
    return {
      activeDocument: this.$store.state.activeDocument

    }
  },
  computed: {
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
  padding: 0 0.7rem;
  resize: both;
}

.__header {
  text-align: left;
  border-bottom: 2px solid gray;
  border-right: 1px solid gray;
  resize: both;
}

.__header:hover {
  background-color: #2970b6;
  cursor: pointer;
}
</style>
