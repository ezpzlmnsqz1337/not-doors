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
      :on-add="addFolder"
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
    ...mapGetters(['getProjectById']),
    ...mapState(['projects', 'openProjects']),
    ...mapState('users', ['activeUser'])
  },
  methods: {
    ...mapMutations(['openProject', 'closeProject', 'addFolder', 'renameProject']),
    ...mapActions(['removeProject', 'toggleProject'])
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
