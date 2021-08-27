<template>
  <div class="__folders">
    <div
      v-for="f in getProjectFolders(project.uid)"
      :key="`folder${f.uid}`"
      class="__item"
    >
      <div
        class="__folder"
        @click.stop="toggleFolder(f)"
      >
        <span
          class="__arrow"
          :class="{__open: openFolders.includes(f)}"
        >&#8250;</span>
        <span
          v-if="!showRename || (f.uid !== folder.uid)"
          class="__name"
        >{{ f.name }}</span>
        <input
          v-show="showRename && f.uid === folder.uid"
          ref="rename"
          v-model="folderName"
          class="__rename"
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
            @click.stop="removeFolder({folder: f})"
          >delete</span>
          <span
            class="material-icons __control"
            @click.stop="showDocumentTemplate(true, f)"
          >add_box</span>
        </div>
      </div>
      <div
        v-if="showTemplate && f.uid === folder.uid"
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
          @click.stop="addDocumentToFolder(folder)"
        >done</span>
        <span
          class="material-icons __control"
          @click.stop="showDocumentTemplate(false)"
        >close</span>
      </div>
      <Documents
        v-if="openFolders.includes(f)"
        :folder="f"
      />
    </div>
  </div>
</template>

<script>
import Documents from '@/components/projects/Documents'
import Key from '@/constants/Key'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

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
      showTemplate: false,
      documentName: 'DocumentName',
      folder: {}
    }
  },
  computed: {
    ...mapState(['openFolders']),
    ...mapGetters(['getProjectFolders', 'getFolderById'])
  },
  methods: {
    ...mapMutations(['openFolder', 'closeFolder', 'addDocument']),
    ...mapMutations({ rf: 'renameFolder' }),
    ...mapActions(['removeFolder']),
    toggleFolder: function (folder) {
      const isOpen = this.openFolders.includes(folder)
      if (!isOpen) {
        this.openFolder({ folder })
      } else {
        this.closeFolder({ folder })
      }
    },
    showRenameInput (show, folder) {
      this.showRename = show
      if (show) {
        this.folder = folder
        this.folderName = folder.name
        this.$nextTick(() =>
          this.$refs.rename.select()
        )
      }
    },
    renameFolder (folder, name) {
      this.rf({ folder, name })
      this.showRename = false
      this.folder = {}
      this.folderName = ''
    },
    handleKeyDownRenameFolder: function (e) {
      if (e.keyCode === Key.ENTER) this.renameFolder(this.folder, this.folderName)
      if (e.keyCode === Key.ESCAPE) this.showRenameInput(false)
    },
    handleKeyDownCreateDocument: function (e) {
      if (e.keyCode === Key.ENTER) this.addDocumentToFolder(this.folder)
      if (e.keyCode === Key.ESCAPE) this.showDocumentTemplate(false)
    },
    showDocumentTemplate: function (show, folder) {
      this.folder = folder
      this.showTemplate = show
      if (show) {
        this.$nextTick(() =>
          this.$refs.name.select()
        )
      }
    },
    addDocumentToFolder: function (folder) {
      this.addDocument({ folderId: folder.uid, name: this.documentName })
      this.openFolder({ folder })
      this.documentName = 'DocumentName'
      this.showTemplate = false
      this.folder = {}
    }
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
