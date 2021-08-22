<template>
  <div class="__projects">
    <div v-for="p in projects" :key="`project${p.uid}`" class="__item" @click="toggleProject(p.uid)">
      <div class="__project">
        <span class="__arrow" :class="{__open: openProjects.includes(p.uid)}">></span>
        <span>{{ p.name }}</span>
      </div>
      <Folders v-if="openProjects.includes(p.uid)" :project="p" />
    </div>
  </div>
</template>

<script>
import Folders from '@/components/projects/Folders'

export default {
  name: 'Projects',
  components: {
    Folders
  },
  data: function () {
    return {
      projects: this.$store.state.projects,
      openProjects: this.$store.state.openProjects
    }
  },
  methods: {
    toggleProject: function (projectId) {
      const index = this.openProjects.findIndex(x => x === projectId)
      if (index === -1) {
        this.openProjects.push(projectId)
      } else {
        this.openProjects.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
.__projects {
  padding-top: 1rem;
}

.__item {
  color: white;
  line-height: 2rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: bold;
}

.__project {
  padding: 0 1rem;
}

.__project:hover{
  background-color: #2970b6;
}

.__arrow {
  transition: transform 0.2s;
  transform: rotate(0);
  display: inline-block;
  margin-right: 0.3rem;
}

.__arrow.__open{
  transform: rotate(90deg);
}
</style>
