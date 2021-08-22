<template>
  <div class="__documentContent">
    <div v-for="o in objects" :key="`object${o.id}`" class="__object">
      <div>{{o.id}}</div>
      <div>{{o.type}}</div>
      <div>{{o.text}}</div>
      <div>{{o.classifictaion}}</div>
    </div>
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
    objects: function () {
      return this.$store.state.objects.filter(x => x.documentId === this.activeDocument.uid)
    }
  }
}
</script>

<style scoped>
.__documentContent {
  flex-direction: row;
  border-bottom: 1px solid gray;
}

.__object{
  display: flex;
}

.__object>div{
  flex-grow: 1;
  height: 1.5rem;
  color: white;
  text-align: left;
  border-right: 1px solid gray;
  padding: 0 0.7rem;
  line-height: 1.5rem;
}
</style>
