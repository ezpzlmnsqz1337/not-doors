<template>
  <div class="__projects">
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
          v-if="openProjects.includes(slotProps.project)"
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
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'Projects',
  components: {
    Folders,
    ProjectsControls,
    CategoryListItems
  },
  computed: {
    ...mapState(['projects', 'openProjects'])
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
</style>
