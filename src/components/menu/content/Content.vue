<template>
  <div class="__content">
    <div class="__heading">
      {{ activeDocument.name }}
    </div>
    <div
      v-for="h in headings"
      :key="`heading${h.uid}`"
      class="__item"
    >
      {{ `${h.chapter}. ${h.text}` }}
    </div>
  </div>
</template>

<script>

export default {
  name: 'Content',
  props: {
    activeDocument: {
      type: Object,
      default: null
    }
  },
  computed: {
    headings: function () {
      return this.$store.state.objects.filter(x => x.documentId === this.activeDocument.uid && x.isHeading)
    }
  }
}
</script>

<style scoped>
.__content {
}

.__heading {
  padding: 0.3rem 1rem;
}

.__item {
  padding: 0.3rem 1rem;
}

.__item:hover {
  cursor: pointer;
  background-color: #2970b6;
}
</style>
