<template>
  <div class="__documentTemplates">
    Document templates
    <div
      v-for="(t, index) in templates"
      :key="index"
      @click="selectTemplate(t)"
    >
      <div>{{ t.name }}</div>
      <div>{{ t.description }}</div>
    </div>

    <Button
      type="primary"
      @click="confirm()"
    >
      Select
    </Button>
  </div>
</template>

<script>
import Button from '@/components/ui/Button'

export default {
  name: 'DocumentTemplates',
  components: {
    Button
  },
  props: {
    activeDocument: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      selected: null
    }
  },
  methods: {
    selectTemplate (template) {
      this.selected = template
    },
    confirm () {
      this.createDocumentFromTemplate({ template: this.selected })
    }
  }
}
</script>

<style scoped>
.__emptyDocument {
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
  align-items: center;
}

.__middleContent {
  max-width: 50%;
  margin: 0 auto;
  text-align: center;
}

.__heading {
  font-size: 1.5rem;
  color: var(--text-light2);
  margin-bottom: 2rem;
}

.__buttons button {
  width: 70%;
  margin-bottom: 0.5rem;
}
</style>
