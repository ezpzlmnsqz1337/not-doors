<template>
  <div
    v-if="!activeUser"
    class="__notLoggedIn"
  >
    Login to access projects
  </div>
  <div
    v-if="activeUser"
    class="__projects"
  >
    <ProjectsControls />
    <CategoryListItems
      :options="options"
    >
      <template #default="slotProps">
        <Folders
          v-if="openProjects.includes(slotProps.project.uid)"
          :parent-id="slotProps.project.uid"
        />
      </template>
    </CategoryListItems>
  </div>
</template>

<script>
import Folders from '@/components/projects/Folders'
import ProjectsControls from '@/components/controls/ProjectsControls'
import CategoryListItems from '@/components/CategoryListItems'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

export default {
  name: 'Projects',
  components: {
    Folders,
    ProjectsControls,
    CategoryListItems
  },
  computed: {
    ...mapState('users', ['activeUser']),
    ...mapState('projects', ['projects', 'openProjects']),
    ...mapGetters('projects', ['getProjectById']),
    options: function () {
      return {
        categories: this.projects,
        category: {
          key: 'project',
          openArray: 'openProjects',
          onOpen: this.openProject,
          onToggle: this.toggleProject,
          onRename: this.renameProject,
          onRemove: this.removeProject,
          name: 'Project'
        },
        subcategory: {
          addIcon: 'create_new_folder',
          onAdd: this.addFolder,
          name: 'Folder'
        },
        bold: true
      }
    }
  },
  updated: function () {
    console.log('updated')
  },
  mounted: function () {
    this.bindProjects()
  },
  methods: {
    ...mapMutations('projects', ['openProject', 'closeProject', 'renameProject']),
    ...mapActions('folders', ['addFolder']),
    ...mapActions('projects', ['removeProject', 'toggleProject', 'renameProject', 'bindProjects'])
  }
}
</script>

<style scoped>
.__projects {
  user-select: none;
}

.__notLoggedIn {
  padding-left: 1rem;
}
</style>
