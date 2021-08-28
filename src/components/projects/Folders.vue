<template>
  <div class="__folders">
    <CategoryListItems
      :categories="getFolders(parentId)"
      category-key="folder"
      :open-categories="openFolders"
      :open-category="openFolder"
      :toggle-category="toggleFolder"
      :on-rename="renameFolder"
      :on-remove="removeFolder"
      :on-add="addDocument"
      :level="level"
    >
      <template #default="slotProps">
        <Folders
          v-if="openFolders.includes(slotProps.folder)"
          :parent-id="slotProps.folder.uid"
          :level="level+1"
        />
        <Documents
          v-if="openFolders.includes(slotProps.folder)"
          :folder="slotProps.folder"
          :level="level+1"
        />
      </template>
    </CategoryListItems>
  </div>
</template>

<script>
import Documents from '@/components/projects/Documents'
import CategoryListItems from '@/components/CategoryListItems'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

export default {
  name: 'Folders',
  components: {
    Documents,
    CategoryListItems
  },
  props: {
    parentId: {
      type: String,
      default: ''
    },
    level: {
      type: Number,
      default: 2
    }
  },
  computed: {
    ...mapState(['openFolders']),
    ...mapGetters(['getFolders'])
  },
  methods: {
    ...mapMutations(['openFolder', 'closeFolder', 'addDocument', 'renameFolder']),
    ...mapActions(['removeFolder', 'toggleFolder'])
  }
}
</script>

<style scoped>
.__item {
  user-select: none;
  color: var(--text-light1);
  line-height: 2rem;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: bold;
}

.__folder{
  display: flex;
  justify-content: flex-end;
  padding-left: 2rem;
}

.__folder:hover{
  background-color: var(--hover);
}

.__folder .__name {
  flex: 1;
}

.__folder:hover .__controls {
  visibility: visible;
}

.__controls {
  visibility: hidden;
  display: flex;
  justify-content: flex-end;
  padding: 0.2rem 1rem 0 0;
}

.__control:hover {
  cursor: pointer;
  color: var(--text-light2);
  border-radius: 0.2rem;
  background-color: var(--hover);
}

.__template {
  display: flex;
  padding: 0 1rem 0 3rem;
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
