<template>
  <div class="__documentTemplates">
    <div class="__heading">
      Document templates
    </div>
    <div
      v-for="(t, index) in templates"
      :key="index"
      class="__template"
      :class="{__selected: selected === t}"
      @click="selectTemplate(t)"
    >
      <div class="__icon">
        <span class="material-icons-outlined">description</span>
      </div>
      <div class="__content">
        <div class="__name">
          {{ t.name }}
        </div>
        <div class="__description">
          {{ t.description }}
        </div>
      </div>
    </div>

    <div class="__buttons">
      <Button
        type="danger"
        @click="$emit('hide')"
      >
        Cancel
      </Button>
      <Button
        type="primary"
        :disabled="selected === null"
        @click="confirm()"
      >
        Select
      </Button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'DocumentTemplates',
  props: {
    activeDocument: {
      type: String,
      default: null
    }
  },
  emits: ['hide'],
  data: function () {
    return {
      selected: null
    }
  },
  computed: {
    ...mapState('templates', ['templates'])
  },
  methods: {
    ...mapActions('templates', ['createDocumentFromTemplate']),
    selectTemplate (template) {
      this.selected = template
    },
    confirm () {
      this.createDocumentFromTemplate({ documentId: this.activeDocument, templateId: this.selected.uid })
      this.$emit('hide')
    }
  }
}
</script>

<style scoped>
.__template{
  display: flex;
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

.__template.__selected{
  background-color: var(--active);
}

.__template:hover{
  cursor: pointer;
  background-color: var(--hover);
  color: var(--text-light1);
}

.__heading {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.__icon {
  display: flex;
  align-items: center;
  padding-right: 0.5em;
}

.__content {
  flex: auto;
}

.__name {
  font-size: 1rem;
}

.__description {

}

.__buttons {
  display: flex;
}

.__buttons button {
  flex: 1;
}
</style>
