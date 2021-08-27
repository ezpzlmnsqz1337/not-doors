<template>
  <div class="__projects">
    <ProjectsControls />
    <div
      v-for="p in projects"
      :key="`project${p.uid}`"
      class="__item"
      @click="toggleProject(p)"
    >
      <div class="__project">
        <span
          class="__arrow"
          :class="{__open: openProjects.includes(p)}"
        >&#8250;</span>
        <span
          v-if="!showRename || (p.uid !== project.uid)"
          class="__name"
        >{{ p.name }}</span>
        <input
          v-show="showRename && p.uid === project.uid"
          ref="rename"
          v-model="projectName"
          class="__rename"
          type="text"
          @keydown="handleKeyDownRenameProject($event)"
          @click.stop
        >
        <div class="__controls">
          <span
            class="material-icons __control"
            @click.stop="showRenameInput(true, p)"
          >edit</span>
          <span
            class="material-icons __control"
            @click.stop="removeProject({project: p})"
          >delete</span>
          <span
            class="material-icons __control"
            @click.stop="showFolderTemplate(true, p)"
          >add_box</span>
        </div>
      </div>
      <div
        v-if="showTemplate && p.uid === project.uid"
        class="__template"
      >
        <input
          ref="name"
          v-model="folderName"
          type="text"
          @keydown="handleKeyDownCreateFolder($event)"
          @click.stop
        >
        <span
          class="material-icons __control"
          @click.stop="addFolderToProject(project)"
        >done</span>
        <span
          class="material-icons __control"
          @click.stop="showFolderTemplate(false)"
        >close</span>
      </div>
      <Folders
        v-if="openProjects.includes(p)"
        :project="p"
      />
    </div>
  </div>
</template>

<script>
import Folders from '@/components/projects/Folders'
import ProjectsControls from '@/components/controls/ProjectsControls'
import Key from '@/constants/Key'
import { mapActions, mapMutations, mapState } from 'vuex'

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
      showRename: false,
      projectName: '',
      project: {}
    }
  },
  computed: {
    ...mapState(['projects', 'openProjects'])
  },
  methods: {
    ...mapMutations(['openProject', 'closeProject', 'addFolder']),
    ...mapMutations({ rp: 'renameProject' }),
    ...mapActions(['removeProject']),
    toggleProject: function (project) {
      const isOpen = this.openProjects.includes(project)
      if (!isOpen) {
        this.openProject({ project })
      } else {
        this.closeProject({ project })
      }
    },
    showRenameInput (show, project) {
      this.showRename = show
      if (show) {
        this.project = project
        this.projectName = project.name
        this.$nextTick(() =>
          this.$refs.rename.select()
        )
      }
    },
    renameProject (project, name) {
      this.rp({ project, name })
      this.showRename = false
      this.project = {}
      this.projectName = ''
    },
    handleKeyDownRenameProject: function (e) {
      if (e.keyCode === Key.ENTER) this.renameProject(this.project, this.projectName)
      if (e.keyCode === Key.ESCAPE) this.showRenameInput(false)
    },
    handleKeyDownCreateFolder: function (e) {
      if (e.keyCode === Key.ENTER) this.addFolderToProject(this.project)
      if (e.keyCode === Key.ESCAPE) this.showFolderTemplate(false)
    },
    showFolderTemplate: function (show, project) {
      this.project = project
      this.showTemplate = show
      if (show) {
        this.$nextTick(() =>
          this.$refs.name.select()
        )
      }
    },
    addFolderToProject: function (project) {
      this.addFolder({ projectId: project.uid, name: this.folderName })
      this.openProject({ project })
      this.folderName = 'FolderName'
      this.showTemplate = false
    }
  }
}
</script>

<style scoped>
.__projects {
  user-select: none;
}

.__item {
  color: var(--text-light1);
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
  background-color: var(--hover);
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
  color: var(--text-light2);
  background-color: var(--hover);
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

.__rename {
  flex: 1;
}
</style>
