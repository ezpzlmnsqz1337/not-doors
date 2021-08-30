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
    getObjectChildren: (state, getters) => (objects) => {
      return objects
        .reduce((acc, cur) => [...acc, cur,
          ...getters.getObjectChildren(cur.objects.map(x => getters.getObjectById(x)))
        ], [])
    },
    getSortedObjects: (state, getters) => (documentId) => {
      documentId = documentId || state.activeDocument
      if (!documentId) return []
      return getters.getTopLevelObjects(documentId)
        .reduce((acc, cur) => [...acc, cur,
          ...getters.getObjectChildren(cur.objects.map(x => getters.getObjectById(x)))
        ], [])
    },
    getOpenDocuments: (state, getters) => () => {
      return state.openDocuments.map(x => getters.getDocumentById(x))
    },
    getActiveDocument: (state, getters) => () => {
      return getters.getDocumentById(state.activeDocument)
    },
    getActiveObject: (state, getters) => () => {
      return getters.getObjectById(state.activeObject)
    },
    getNextObjectId: (state, getters) => (documentId) => {
      return getters.getDocumentObjects(documentId).reduce((acc, { id }) => id > acc ? id : acc, 0) + 1
    },
    getTopLevelObjects: (state, getters) => (documentId) => {
      return getters.getRootObject(documentId).objects.map(x => getters.getObjectById(x))
    },
    getRootObject: (state, getters) => (documentId) => {
      return getters.getDocumentObjects(documentId).find(x => x.name === 'root')
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
      const documentId = uuidv4()
      state.documents.push({ uid: documentId, name, parentId: parent.uid, columns: state.columns })
      // add root object
      state.objects.push({ uid: uuidv4(), name: 'root', objects: [], invisible: true, documentId })
    },
    removeDocumentAtIndex (state, { document }) {
      if (!document) return
      const index = state.documents.findIndex(x => x.uid === document.uid)
      state.documents.splice(index, 1)
    },
    addFirstObjectToDocument (state, { documentId }) {
      const uid = uuidv4()
      const parent = state.objects.find(x => x.name === 'root' && x.documentId === documentId)
      parent.objects.push(uid)

      state.objects.push({
        uid,
        chapter: '1',
        id: 1,
        parentId: parent.uid,
        isHeading: true,
        documentId,
        classification: [],
        objects: [],
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
      if (object && state.hoverObject === object.uid) return
      state.hoverObject = object ? object.uid : null
    },
    setActiveObject (state, { object }) {
      if (object && state.activeObject === object.uid) return
      state.activeObject = object ? object.uid : null
    },
    setColumnWidth (state, { column, width }) {
      column.width = width
    },
    setObjectChapter (state, { object, chapter }) {
      object.chapter = chapter
    },
    addObjectToParent (state, { parent, object, index }) {
      object = {
        ...object,
        uid: uuidv4(),
        classification: [],
        isHeading: false,
        objects: []
      }
      state.objects.push(object)
      parent.objects.splice(index, 0, object.uid)
    },
    updateObjectsOrder (state, { newOrder }) {
      state.objects = newOrder
    },
    removeObject (state, { object }) {
      const { parentId, uid } = object
      const parent = state.objects.find(x => x.uid === parentId)

      const indexInParent = parent.objects.indexOf(uid)
      parent.objects.splice(indexInParent, 1)

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
      const oldParent = state.objects.find(x => x.uid === object.parentId)
      const i1 = oldParent.objects.indexOf(object.uid)
      oldParent.objects.splice(i1, 1)

      const newParent = state.objects.find(x => x.uid === after.parentId)
      const i2 = newParent.objects.indexOf(after.uid) + 1
      newParent.objects.splice(i2, 0, object.uid)

      object.parentId = after.parentId
    },
    moveObjectBelow (state, { below, object }) {
      const oldParent = state.objects.find(x => x.uid === object.parentId)
      const i1 = oldParent.objects.indexOf(object.uid)
      oldParent.objects.splice(i1, 1)

      below.objects.splice(0, 0, object.uid)
      object.parentId = below.uid
    }
  },
  actions: {
    addObjectAfter ({ commit, getters }, { object, newObject }) {
      const { parentId, documentId, uid } = object

      const parent = getters.getObjectById(parentId)
      const index = parent.objects.indexOf(uid) + 1

      // TODO: have document have max ID
      const id = getters.getNextObjectId(documentId)
      newObject = { ...newObject, id, documentId, parentId }

      commit('addObjectToParent', { parent, object: newObject, index })
    },
    addObjectBelow ({ commit, getters }, { object, newObject }) {
      const { documentId, uid: parentId } = object

      const index = 0
      const id = getters.getNextObjectId(documentId)

      newObject = { ...newObject, id, documentId, parentId }
      commit('addObjectToParent', { parent: object, object: newObject, index })
    },
    calculateChapters ({ getters, dispatch, commit }, { document = null, headings, chapter = '' }) {
      headings = headings || getters.getTopLevelObjects(document.uid).filter(x => x.isHeading)
      headings
        .forEach((x, index) => {
          const ch = chapter ? `${chapter}.${index + 1}` : `${index + 1}`
          commit('setObjectChapter', { object: x, chapter: ch })
          const childrenHeadings = x.objects.map(y => getters.getObjectById(y)).filter(y => y.isHeading)
          dispatch('calculateChapters', { headings: childrenHeadings, chapter: x.chapter })
        })
    },
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
      if (state.activeDocument === document.uid) commit('closeDocument')
      state.objects.filter(x => x.documentId === document.uid).forEach(x => commit('removeObject', { object: x }))
      commit('removeDocumentAtIndex', { index })
    }
  },
  strict: debug,
  plugins: debug ? [logger, createPersistedState()] : []
})
