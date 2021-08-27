import { createStore, createLogger } from 'vuex'
import users from '@/modules/users'
import { objects } from '@/assets/db/objects'
import { projects } from '@/assets/db/projects'
import { folders } from '@/assets/db/folders'
import { documents } from '@/assets/db/documents'
import { columns } from '@/assets/db/columns'
import MenuItem from '@/constants/MenuItem'
import { v4 as uuidv4 } from 'uuid'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    users
  },
  state: {
    columns,
    projects,
    documents,
    folders,
    objects,
    openProjects: [],
    openFolders: [],
    openDocuments: [],
    activeDocument: null,
    activeObject: null,
    activeMenuContent: MenuItem.PROJECTS,
    menuItems: [
      { id: MenuItem.PROJECTS, name: 'Projects', icon: 'folder', activeDocument: false },
      { id: MenuItem.CONTENT, name: 'Content', icon: 'list', activeDocument: true }
    ]
  },
  getters: {
    getProjectById: (state) => (projectId) => {
      const project = state.projects.find(x => x.uid === projectId)
      if (!project) throw new Error(`Project ${projectId} not found`)
      return project
    },
    getFolderById: (state) => (folderId) => {
      const folder = state.folders.find(x => x.uid === folderId)
      if (!folder) throw new Error(`Folder ${folderId} not found`)
      return folder
    },
    getDocumentById: (state) => (documentId) => {
      const doc = state.documents.find(x => x.uid === documentId)
      if (!doc) throw new Error(`Document ${documentId} not found`)
      return doc
    },
    getObjectById: (state) => (objectId) => {
      const obj = state.objects.find(x => x.uid === objectId)
      if (!obj) throw new Error(`Object ${objectId} not found`)
      return obj
    },
    getMenuItemById: (state) => (id) => {
      const item = state.menuItems.find(x => x.id === id)
      if (!item) throw new Error(`Menu item ${id} not found!`)
      return item
    },
    getColumnById: (state) => (columnId) => {
      const column = state.columns.filter(x => x.uid === columnId).pop()
      if (!column) throw new Error(`Column ${columnId} not found`)
      return column
    },
    getDocumentObjects: (state) => (documentId) => {
      return state.objects.filter(x => x.documentId === documentId)
    },
    getSortedObjects: (state, getters) => (documentId) => {
      const documentObjects = getters.getDocumentObjects(documentId)
      const getObjectChildren = (result = [], objects, parentId = 0) => {
        objects
          .filter(x => x.parentId === parentId)
          .sort((a, b) => a.order - b.order)
          .forEach(x => {
            result.push(x)
            getObjectChildren(result, objects, x.uid)
          })
      }
      const result = []
      getObjectChildren(result, documentObjects)
      return result
    }
  },
  mutations: {
    addProject (state, { name }) {
      state.projects.push({ uid: uuidv4(), name })
    },
    removeProject (state, { project }) {
      if (!project) return
      const index = state.projects.findIndex(x => x.uid === project.uid)
      state.folders.filter(x => x.projectId === project.uid).forEach(x => this.removeFolder(x))
      state.projects.splice(index, 1)
    },
    addFolder (state, { projectId, name }) {
      state.folders.push({ uid: uuidv4(), name, projectId })
    },
    removeFolder (state, { folder }) {
      if (!folder) return
      const index = state.folders.findIndex(x => x.uid === folder.uid)
      state.documents.filter(x => x.folderId === folder.uid).forEach(x => this.removeDocument(x))
      state.folders.splice(index, 1)
    },
    addDocument (state, { folderId, name }) {
      state.documents.push({ uid: uuidv4(), name, folderId })
    },
    removeDocument (state, document) {
      if (!document) return
      const index = state.documents.findIndex(x => x.uid === document.uid)
      state.documents.splice(index, 1)
    },
    addFirstObjectToDocument (state, { documentId, object }) {
      state.objects.push({
        ...object,
        uid: uuidv4(),
        id: 1,
        parentId: 0,
        order: 1,
        isHeading: true,
        documentId,
        classification: [],
        type: 'PROSE',
        text: 'Dummy text'
      })
    },
    openProject (state, { project }) {
      if (!project) return
      state.openProjects.push(project)
    },
    closeProject (state, { project }) {
      const openProjects = state.openProjects
      const index = openProjects.findIndex(x => x === project.uid)
      if (index !== -1) openProjects.splice(index, 1)
    },
    openFolder (state, { folder }) {
      if (!folder) state.openFolders.push(folder)
    },
    closeFolder (state, { folder }) {
      const openFolders = state.openFolders
      const index = openFolders.findIndex(x => x === folder.uid)
      if (index !== -1) openFolders.splice(index, 1)
    },
    openDocument (state, { document }) {
      const od = state.openDocuments.map(x => x.uid)
      if (!od.includes(document.uid)) state.openDocuments.push(document)
      state.activeDocument = document
    },
    closeDocument (state, { document }) {
      const index = state.openDocuments.findIndex(x => x.uid === document.uid)
      if (index === -1) return
      state.openDocuments.splice(index, 1)
      state.activeDocument = state.openDocuments.at(0)
    },
    setActiveMenuContent (state, { type }) {
      state.activeMenuContent = type
    },
    setActiveObject (state, { object }) {
      state.activeObject = object
    },
    calculateChapters (state, { document }) {
      const hs = state.objects.filter(x => x.documentId === document && x.isHeading)
      const calculateChaptersDeep = (headings, parentId = 0, chapter = '') => {
        headings
          .filter(x => x.parentId === parentId)
          .sort((a, b) => a.order - b.order)
          .forEach((x, index) => {
            x.chapter = chapter ? `${chapter}.${index + 1}` : `${index + 1}`
            calculateChaptersDeep(headings, x.uid, x.chapter)
          })
      }

      calculateChaptersDeep(hs)
    },
    addObjectAfter (state, { object, newObject }) {
      const { order, parentId, documentId } = object

      const objects = state.objects.filter(x => x.documentId === documentId)
      objects
        .filter(x => x.parentId === parentId && x.order > order)
        .forEach(x => x.order++)

      const id = objects.reduce((acc, { id }) => id > acc ? id : acc, 0)

      state.objects.push({
        ...newObject,
        uid: uuidv4(),
        id,
        order: order + 1,
        documentId,
        parentId,
        classification: [],
        isHeading: false
      })
    },
    addObjectBelow (state, { object, data }) {
      const { documentId, uid } = object

      const objects = state.objects.filter(x => x.documentId === documentId)
      objects
        .filter(x.parentId === uid)
        .forEach(x => x.order++)

      const id = objects.reduce((acc, { id }) => id > acc ? id : acc, 0)

      state.objects.push({
        ...data,
        uid: uuidv4(),
        id,
        order: 1,
        documentId,
        parentId: uid,
        classification: [],
        isHeading: false
      })
    },
    removeObject (state, { object }) {
      const { parentId, documentId, order, uid } = object
      state.objects.filter(x => x.documentId === documentId)
        .filter(x => x.parentId === parentId && x.order > order)
        .forEach(x => x.order--)
      const index = state.objects.findIndex(x => x.uid === uid)
      state.objects.splice(index, 1)
    }
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})