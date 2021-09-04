<template>
  <div class="__controls">
    <span class="__heading">Controls</span>
    <span
      class="material-icons __control"
      @click="showProjectTemplate(true)"
    >add_box</span>
  </div>
  <div
    v-if="showTemplate"
    class="__template"
  >
    <input
      ref="name"
      v-model="projectName"
      type="text"
      @keydown="handleKeyDown($event)"
    >
    <span
      class="material-icons __control"
      @click="addProject()"
    >done</span>
    <span
      class="material-icons __control"
      @click.stop="showProjectTemplate(false)"
    >close</span>
  </div>
</template>

<script>
import Key from '@/constants/Key'
import { mapMutations } from 'vuex'

export default {
  name: 'ProjectControls',
  data: function () {
    return {
      showTemplate: false,
      projectName: 'Project'
    }
  },
  methods: {
    ...mapMutations('projects', { ap: 'addProject' }),
    handleKeyDown: function (e) {
      if (e.keyCode === Key.ENTER) this.addProject()
      if (e.keyCode === Key.ESCAPE) this.showProjectTemplate(false)
    },
    showProjectTemplate: function (show) {
      this.showTemplate = show
      if (show) {
        this.$nextTick(() =>
          this.$refs.name.select()
        )
      }
    },
    addProject: function () {
      this.ap({ name: this.projectName })
      this.projectName = 'Project'
      this.showTemplate = false
    }
  }
}
</script>

<style scoped>
.__controls {
  display: flex;
  justify-content: flex-end;
  padding-right: 1rem;
  background-color: var(--bg-dark4);
  padding: 0.2rem 1rem;
}

.__controls > .__heading {
  flex: 1;
  line-height: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
}

.__control:hover {
  cursor: pointer;
  background-color: var(--hover);
  border-radius: 0.2rem;
  color: var(--text-light2);
}

.__template {
  display: flex;
  padding: 0 1rem 0 1.5rem;
}

.__template > input {
  flex: 1;
  margin-right: 0.5rem;
}
</style>
