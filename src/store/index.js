import { createStore, createLogger } from 'vuex'
import users from '@/store/modules/users'
import MenuItem from '@/constants/MenuItem'
import { columns } from '@/assets/db/columns'
import { v4 as uuidv4 } from 'uuid'
import createPersistedState from 'vuex-persistedstate'

const debug = process.env.NODE_ENV !== 'production'

const logger = createLogger({
  filter (mutation, stateBefore, stateAfter) {
    return !['setHoverObject'].includes(mutation.type)
  }
})

export default createStore({
  modules: {
    users
  },
  state: {
    columns,
    projects: [],
    documents: [],
    folders: [],
    objects: [],
    openProjects: [],
    openFolders: [],
    openDocuments: [],
    activeDocument: null,
    activeObject: null,
    hoverObject: null,
    activeMenuContent: MenuItem.PROJECTS,
    menuItems: [
      { id: MenuItem.PROJECTS, name: 'Projects', icon: 'folder', activeDocument: false },
      { id: MenuItem.CONTENT, name: 'Content', icon: 'list', activeDocument: true }
    ]
  },
  getters: {
    getProjectById: (state) => (projectId) => {
      return state.projects.find(x => x.uid === projectId)
    },
    getFolderById: (state) => (folderId) => {
      return state.folders.find(x => x.uid === folderId)
    },
    getDocumentById: (state) => (documentId) => {
      return state.documents.find(x => x.uid === documentId)
    },
    getObjectById: (state) => (objectId) => {
      return state.objects.find(x => x.uid === objectId)
    },
    getMenuItemById: (state) => (id) => {
      return state.menuItems.find(x => x.id === id)
    },
    getColumnById: (state) => (columnId) => {
      return state.columns.find(x => x.uid === columnId)
    },
    getFolders: (state) => (parentId) => {
      return state.folders.filter(x => x.parentId === parentId)
    },
    getDocuments: (state) => (parentId) => {
      return state.documents.filter(x => x.parentId === parentId)
    },
    getDocumentObjects: (state) => (documentId) => {
      return state.objects.filter(x => x.documentId === documentId)
    },
    getSortedObjects: (state, getters) => (documentId) => {
      documentId = documentId || state.activeDocument
      if (!documentId) return []
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
    },
    getOpenDocuments: (state, getters) => () => {
      return state.openDocuments.map(x => getters.getDocumentById(x))
    },
    getActiveDocument: (state, getters) => () => {
      return getters.getDocumentById(state.activeDocument)
    },
    getActiveObject: (state, getters) => () => {
      return getters.getObjectById(state.activeObject)
    }
  },
  mutations: {
    addProject (state, { name }) {
      state.projects.push({ uid: uuidv4(), name })
    },
    renameProject (state, { project, name }) {
      project.name = name
    },
    removeProjectAtIndex (state, { index }) {
      state.projects.splice(index, 1)
    },
    addFolder (state, { parent, name }) {
      state.folders.push({ uid: uuidv4(), name, parentId: parent.uid })
    },
    renameFolder (state, { folder, name }) {
      folder.name = name
    },
    removeFolderAtIndex (state, { index }) {
      state.folders.splice(index, 1)
    },
    addDocument (state, { parent, name }) {
      state.documents.push({ uid: uuidv4(), name, parentId: parent.uid, columns: state.columns })
    },
    removeDocumentAtIndex (state, { document }) {
      if (!document) return
      const index = state.documents.findIndex(x => x.uid === document.uid)
      state.documents.splice(index, 1)
    },
    addFirstObjectToDocument (state, { documentId }) {
      console.log(state.objects)
      state.objects.push({
        uid: uuidv4(),
        chapter: '1',
        id: 1,
        parentId: 0,
        order: 1,
        isHeading: true,
        documentId,
        classification: [],
        type: 'PROSE',
        text: 'Dummy text'
      })
      console.log('AFTER: ', state.objects)
    },
    openProject ({ openProjects }, { project }) {
      if (!project) return
      if (!openProjects.includes(project.uid)) openProjects.push(project.uid)
    },
    closeProject ({ openProjects }, { project }) {
      const index = openProjects.findIndex(x => x === project.uid)
      if (index !== -1) openProjects.splice(index, 1)
    },
    openFolder ({ openFolders }, { folder }) {
      if (!folder) return
      if (!openFolders.includes(folder.uid)) openFolders.push(folder.uid)
    },
    closeFolder ({ openFolders }, { folder }) {
      const index = openFolders.findIndex(x => x === folder.uid)
      if (index !== -1) openFolders.splice(index, 1)
    },
    openDocument (state, { document }) {
      if (!document) return
      const { openDocuments: od } = state
      if (!od.includes(document.uid)) od.push(document.uid)
      state.activeDocument = document.uid
    },
    closeDocument (state, { document }) {
      const { openDocuments: od } = state
      const index = od.findIndex(x => x === document.uid)
      if (index === -1) return
      od.splice(index, 1)
      state.activeDocument = od.length > 0 ? od.at(0) : null
    },
    setActiveMenuContent (state, { type }) {
      state.activeMenuContent = type
    },
    setHoverObject (state, { object }) {
      if (!object || state.hoverObject === object.uid) return
      state.hoverObject = object.uid
    },
    setActiveObject (state, { object }) {
      if (!object || state.activeObject === object.uid) return
      state.activeObject = object.uid
    },
    setColumnWidth (state, { column, width }) {
      column.width = width
    },
    calculateChapters (state, { document }) {
      if (!document) return
      const hs = state.objects.filter(x => x.documentId === document.uid && x.isHeading)
      const calculateChaptersDeep = (headings, parentId = 0, chapter = '') => {
        console.log('Chapters deep')
        headings
          .filter(x => x.parentId === parentId)
          .sort((a, b) => a.order - b.order)
          .forEach((x, index) => {
            x.chapter = chapter ? `${chapter}.${index + 1}` : `${index + 1}`
            calculateChaptersDeep(headings, x.uid, x.chapter)
          })
      }
      console.log('Chapters')
      calculateChaptersDeep(hs)
    },
    addObjectAfter (state, { object, newObject }) {
      const { order, parentId, documentId } = object

      const objects = state.objects.filter(x => x.documentId === documentId)
      objects
        .filter(x => x.parentId === parentId && x.order > order)
        .forEach(x => x.order++)

      const id = objects.reduce((acc, { id }) => id > acc ? id : acc, 0) + 1

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
    addObjectBelow (state, { object, newObject }) {
      const { documentId, uid } = object

      const objects = state.objects.filter(x => x.documentId === documentId)
      objects
        .filter(x => x.parentId === uid)
        .forEach(x => x.order++)

      const id = objects.reduce((acc, { id }) => id > acc ? id : acc, 0) + 1

      state.objects.push({
        ...newObject,
        uid: uuidv4(),
        id,
        order: 1,
        documentId,
        parentId: uid,
        classification: [],
        isHeading: false
      })
    },
    updateObjectsOrder (state, { newOrder }) {
      state.objects = newOrder
    },
    removeObject (state, { object }) {
      const { parentId, documentId, order, uid } = object
      state.objects.filter(x => x.documentId === documentId)
        .filter(x => x.parentId === parentId && x.order > order)
        .forEach(x => x.order--)
      const index = state.objects.findIndex(x => x.uid === uid)
      state.objects.splice(index, 1)
    },
    toggleObjectTitle (state, { object }) {
      object.isHeading = !object.isHeading
    },
    setObjectProperty (state, { object, key, value }) {
      object[key] = value
    },
    moveObjectAfter (state, { after, object }) {
      state.objects.filter(x => x.uid !== after.uid && x.parentId === after.parentId && x.order > after.order).forEach(x => x.order++)
      state.objects.filter(x => x.uid !== object.uid && x.parentId === object.parentId && x.order > object.order).forEach(x => x.order--)
      object.parentId = after.parentId
      object.order = after.order + 1
    },
    moveObjectBelow (state, { below, object }) {
      state.objects.filter(x => ![below.uid, object.uid].includes(x.uid) && x.parentId === below.uid).forEach(x => x.order++)
      state.objects.filter(x => ![below.uid, object.uid].includes(x.uid) && x.parentId === object.parentId && x.order > object.order).forEach(x => x.order--)
      object.parentId = below.uid
      object.order = 1
    }
  },
  actions: {
    removeProject ({ commit, dispatch, state }, { project }) {
      if (!project) return
      const index = state.projects.findIndex(x => x.uid === project.uid)
      state.folders.filter(x => x.projectId === project.uid).forEach(x => dispatch('removeFolder', { folder: x }))
      commit('removeProjectAtIndex', { index })
    },
    toggleProject ({ commit, state }, { project }) {
      const isOpen = state.openProjects.includes(project.uid)
      if (!isOpen) {
        commit('openProject', { project })
      } else {
        commit('closeProject', { project })
      }
    },
    removeFolder ({ commit, dispatch, state }, { folder }) {
      if (!folder) return
      const index = state.folders.findIndex(x => x.uid === folder.uid)
      state.documents.filter(x => x.folderId === folder.uid).forEach(x => dispatch('removeDocument', { document: x }))
      commit('removeFolderAtIndex', { index })
    },
    toggleFolder ({ commit, state }, { folder }) {
      const isOpen = state.openFolders.includes(folder.uid)
      if (!isOpen) {
        commit('openFolder', { folder })
      } else {
        commit('closeFolder', { folder })
      }
    },
    removeDocument ({ commit, state }, { document }) {
      if (!document) return
      const index = state.documents.findIndex(x => x.uid === document.uid)
      state.objects.filter(x => x.documentId === document.uid).forEach(x => commit('removeObject', { object: x }))
      commit('removeDocumentAtIndex', { index })
    }
  },
  strict: debug,
  plugins: debug ? [logger, createPersistedState()] : []
})
