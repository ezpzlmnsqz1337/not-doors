<template>
  <div class="__folders">
    <div class="__item" v-for="f in folders" :key="`folder${f.uid}`">
      <div class="__folder" @click.stop="toggleFolder(f.uid)">
        <span class="__arrow" :class="{__open: openFolders.includes(f.uid)}">></span>
        <span>{{ f.name }}</span>
      </div>
      <Documents v-if="openFolders.includes(f.uid)" :folder="f"/>
    </div>
  </div>
</template>

<script>
import Documents from '@/components/projects/Documents'

export default {
  name: 'Folders',
  components: {
    Documents
  },
  props: {
    project: {
      type: Object,
      default: null
    }
  },
  data: function () {
    return {
      folders: this.$store.state.folders.filter(x => x.projectId === this.project.uid),
      openFolders: this.$store.state.openFolders
    }
  },
  methods: {
    toggleFolder: function (folderId) {
      const index = this.openFolders.findIndex(x => x === folderId)
      if (index === -1) {
        this.openFolders.push(folderId)
      } else {
        this.openFolders.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped>
.__folders {

}

.__item {
  color: white;
  line-height: 2rem;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: bold;
}

.__folder{
  padding-left: 1rem;
}

.__folder:hover{
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
