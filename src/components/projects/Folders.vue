<template>
  <div class="__folders">
    <div
      v-for="f in folders"
      :key="`folder${f.uid}`"
      class="__item"
    >
      <div
        class="__folder"
        @click.stop="toggleFolder(f.uid)"
      >
        <span
          class="__arrow"
          :class="{__open: openFolders.includes(f.uid)}"
        >&#8250;</span>
        <span
          v-if="!showRename"
          class="__name"
        >{{ f.name }}</span>
        <input
          v-if="showRename"
          ref="rename"
          v-model="folderName"
          type="text"
          @keydown="handleKeyDownRenameFolder($event)"
          @click.stop
        >
        <div class="__controls">
          <span
            class="material-icons __control"
            @click.stop="showRenameInput(true, f)"
          >edit</span>
          <span
            class="material-icons __control"
            @click.stop="removeFolder(f.uid)"
          >delete</span>
          <span
            class="material-icons __control"
            @click.stop="showDocumentTemplate(true, f.uid)"
          >add_box</span>
        </div>
      </div>
      <div
        v-if="showTemplate && f.uid === folderId"
        class="__template"
      >
        <input
          ref="name"
          v-model="documentName"
          type="text"
          @keydown="handleKeyDownCreateDocument($event)"
          @click.stop
        >
        <span
          class="material-icons __control"
          @click.stop="addDocumentToFolder(folderId)"
        >done</span>
        <span
          class="material-icons __control"
          @click.stop="showDocumentTemplate(false)"
        >close</span>
      </div>
      <Documents
        v-if="openFolders.includes(f.uid)"
        :folder="f"
      />
    </div>
  </div>
</template>

<script>
import Documents from '@/components/projects/Documents'
import Key from '@/constants/Key'

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
      showRename: false,
      folderName: '',
      renameFolderId: '',
      showTemplate: false,
      documentName: 'DocumentName',
      folderId: ''
    }
  },
  computed: {
    folders: function () {
      return this.$store.state.folders.filter(x => x.projectId === this.project.uid)
    },
    openFolders: function () {
      return this.$store.state.openFolders
    }
  },
  methods: {
    toggleFolder: function (folderId) {
      const isOpen = this.openFolders.includes(folderId)
      if (!isOpen) {
        this.$store.openFolder(folderId)
      } else {
        this.$store.closeFolder(folderId)
      }
    },
    openFolder (folderId) {
      this.$store.openFolder(folderId)
    },
    showRenameInput (show, folder) {
      this.showRename = show
      if (show) {
        this.renameFolderId = folder.uid
        this.folderName = folder.name
        this.$nextTick(() =>
          this.$refs.rename.select()
        )
      }
    },
    renameFolder (folderId, name) {
      this.$store.findFolder(folderId).name = name
      this.showRename = false
      this.renameFolderId = ''
      this.folderName = ''
    },
    handleKeyDownRenameFolder: function (e) {
      if (e.keyCode === Key.ENTER) this.renameFolder(this.renameFolderId, this.folderName)
      if (e.keyCode === Key.ESCAPE) this.showRenameInput(false)
    },
    removeFolder (folderId) {
      this.$store.removeFolder(folderId)
    },
    handleKeyDownCreateDocument: function (e) {
      if (e.keyCode === Key.ENTER) this.addDocumentToFolder(this.folderId)
      if (e.keyCode === Key.ESCAPE) this.showDocumentTemplate(false)
    },
    showDocumentTemplate: function (show, folderId) {
      this.folderId = folderId
      this.showTemplate = show
      if (show) {
        this.$nextTick(() =>
          this.$refs.name.select()
        )
      }
    },
    addDocumentToFolder: function (folderId) {
      this.$store.addDocumentToFolder(folderId, this.documentName)
      this.openFolder(folderId)
      this.documentName = 'DocumentName'
      this.showTemplate = false
      this.folderId = ''
    }
  }
}
</script>

<style scoped>
.__item {
  user-select: none;
  color: white;
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
  background-color: #2970b6;
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
  color: gray;
  border-radius: 0.2rem;
  background-color: #2970b6;
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
</style>
