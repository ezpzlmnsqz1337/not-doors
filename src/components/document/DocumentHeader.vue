<template>
  <div class="__documentHeader">
    <div v-for="c in columns" :key="c.name" class="__column">{{ c.name }}</div>
  </div>
</template>

<script>
export default {
  name: 'DocumentHeader',
  data: function () {
    return {
      columns: this.$store.state.columns
    }
  }
}
</script>

<style scoped>
.__documentHeader {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid gray;
}

.__column {
  flex-grow: 1;
  height: 1.5rem;
  color: white;
  text-align: left;
  border-right: 1px solid gray;
  padding: 0 0.7rem;
  line-height: 1.5rem;
}

.__column:hover {
  background-color: #2970b6;
  cursor: pointer;
}
</style>
