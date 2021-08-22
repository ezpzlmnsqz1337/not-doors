<template>
  <div class="__projects">
    <ProjectsControls />
    <div v-for="p in projects" :key="`project${p.uid}`" class="__item" @click="toggleProject(p.uid)">
      <div class="__project" >
        <span class="__arrow" :class="{__open: openProjects.includes(p.uid)}">&#8250;</span>
        <span class="__name">{{ p.name }}</span>
        <div class="__controls">
          <span class="material-icons __control" @click.stop="renameProject(p.uid)">edit</span>
          <span class="material-icons __control" @click.stop="removeProject(p.uid)">delete</span>
          <span class="material-icons __control" @click.stop="showFolderTemplate(true, p.uid)">add_box</span>
        </div>
      </div>
      <div v-if="showTemplate && p.uid === projectId" class="__template">
        <input type="text" v-model="folderName" @keydown="handleKeyDown($event)" @click.stop ref="name" />
        <span class="material-icons __control" @click.stop="addFolderToProject(projectId)">done</span>
        <span class="material-icons __control" @click.stop="showFolderTemplate(false)">close</span>
      </div>
      <Folders v-if="openProjects.includes(p.uid)" :project="p" />
    </div>
  </div>
</template>

<script>
import Folders from '@/components/projects/Folders'
import ProjectsControls from '@/components/controls/ProjectsControls'
import Key from '@/constants/Key'

export default {
  name: 'Projects',
  components: {
    Folders,
    ProjectsControls
  },
  data: function () {
    return {
      showTemplate: false,
      folderName: 'FolderName',
      projectId: ''
    }
  },
  methods: {
    toggleProject: function (projectId) {
      const isOpen = this.openProjects.includes(projectId)
      if (!isOpen) {
        this.$store.openProject(projectId)
      } else {
        this.$store.closeProject(projectId)
      }
    },
    removeProject: function (projectId) {
      this.$store.removeProject(projectId)
    },
    openProject: function (projectId) {
      this.$store.openProject(projectId)
    },
    handleKeyDown: function (e) {
      if (e.keyCode === Key.ENTER) this.addFolderToProject(this.projectId)
      if (e.keyCode === Key.ESCAPE) this.showFolderTemplate(false)
    },
    showFolderTemplate: function (show, projectId) {
      this.projectId = projectId
      this.showTemplate = show
      if (show) {
        this.$nextTick(() =>
          this.$refs.name.select()
        )
      }
    },
    addFolderToProject: function (projectId) {
      this.$store.addFolderToProject(projectId, this.folderName)
      this.openProject(projectId)
      this.folderName = 'FolderName'
      this.showTemplate = false
    }
  },
  computed: {
    projects: function () {
      return this.$store.state.projects
    },
    openProjects: function () {
      return this.$store.state.openProjects
    }
  }
}
</script>

<style scoped>
.__projects {
  user-select: none;
}

.__item {
  color: white;
  line-height: 2rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: bold;
}

.__project {
  display: flex;
  justify-content: flex-end;
  padding: 0 1rem;
}

.__project:hover{
  background-color: #2970b6;
}

.__project .__name {
  flex: 1;
}

.__project:hover .__controls {
  visibility: visible;
}

.__controls {
  visibility: hidden;
  display: flex;
  justify-content: flex-end;
  padding: 0.2rem 0;
}

.__controls > .__heading {
  flex: 1;
  line-height: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
}

.__control:hover {
  cursor: pointer;
  border-radius: 0.2rem;
  color: gray;
  background-color: #2970b6;
}

.__template {
  display: flex;
  padding: 0 1rem 0 2rem;
}

.__template > input {
  flex: 1;
  margin-right: 0.5rem;
}

.__arrow {
  flex: 0;
  transition: transform 0.2s;
  transform: rotate(0);
  display: inline-block;
  margin-right: 0.3rem;
}

.__arrow.__open{
  transform: rotate(90deg);
}
</style>
