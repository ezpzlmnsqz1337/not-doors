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
      :categories="projects"
      category-key="project"
      :open-categories="openProjects"
      :open-category="openProject"
      :toggle-category="toggleProject"
      :on-rename="renameProject"
      :on-remove="removeProject"
      :on-subcategory-add="addFolder"
      add-subcategory-icon="create_new_folder"
      bold
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
    ...mapGetters('projects', ['getProjectById'])
  },
  methods: {
    ...mapMutations('projects', ['openProject', 'closeProject', 'renameProject']),
    ...mapMutations('folders', ['addFolder']),
    ...mapActions('projects', ['removeProject', 'toggleProject'])
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
