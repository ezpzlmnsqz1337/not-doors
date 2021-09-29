import createDocument from '@/model/document'
import { db } from '@/firebase'
import { doc, query, where, collection, getDocs, deleteDoc, updateDoc, setDoc } from 'firebase/firestore'
import { bindFirestoreCollection, vuexMutations } from '@/vuex-firestore-binding'

const state = () => ({
  documents: [],
  openDocuments: [],
  activeDocument: null
})

// getters
const getters = {
  getDocumentById: (state) => (documentId) => {
    return state.documents.find(x => x.uid === documentId)
  },
  getDocumentByName: (state) => (name) => {
    return state.documents.find(x => x.name === name)
  },
  getDocuments: (state) => (folderId) => {
    return state.documents.filter(x => x.parentId === folderId)
  },
  getDocumentObjects: (state, getters, rootState) => (documentId) => {
    return rootState.objects.objects.filter(x => x.documentId === documentId)
  },
  getOpenDocuments: (state, getters) => () => {
    return state.openDocuments.map(x => getters.getDocumentById(x))
  },
  getActiveDocument: (state, getters) => () => {
    if (!state.activeDocument) return
    return getters.getDocumentById(state.activeDocument)
  },
  getTopLevelObjects: (state, getters, rootState, rootGetters) => (documentId) => {
    return getters.getRootObject(documentId).objects.map(x => rootGetters['objects/getObjectById'](x))
  },
  getRootObject: (state, getters) => (documentId) => {
    return getters.getDocumentObjects(documentId).find(x => x.root)
  },
  getNextObjectId: (state, getters) => (documentId) => {
    return getters.getDocumentObjects(documentId).reduce((acc, { id }) => id > acc ? id : acc, 0) + 1
  },
  getSortedObjects: (state, getters, rootState, rootGetters) => (documentId) => {
    documentId = documentId || state.activeDocument
    if (!documentId) return []
    return getters.getTopLevelObjects(documentId)
      .reduce((acc, cur) => [...acc, cur,
        ...rootGetters['objects/getObjectChildren'](cur.objects.map(x => rootGetters['objects/getObjectById'](x)))
      ], [])
  }
}

// actions
const actions = {
  async addDocument ({ rootState, dispatch }, { parent, name }) {
    const document = { ...createDocument(), name, parentId: parent.uid, columns: rootState.columns.columns.map(x => x.uid) }
    const docRef = doc(db, 'documents', document.uid)
    await setDoc(docRef, document)
    // add root object
    dispatch('objects/addRootObject', { documentId: document.uid }, { root: true })
  },
  async renameDocument ({ dispatch }, { document, name }) {
    const docRef = doc(db, 'documents', document.uid)
    await updateDoc(docRef, { name })
  },
  async removeDocument ({ commit, dispatch }, { document }) {
    if (!document) return
    commit('closeDocument', { document })
    const q = query(collection(db, 'documents'), where('parentId', '==', document.uid))
    const documentObjects = await getDocs(q)
    documentObjects.forEach(x => dispatch('objects/removeObject', { object: x.data() }, { root: true }))
    await deleteDoc(doc(db, 'documents', document.uid))
  },
  calculateChapters ({ getters, dispatch, commit, rootGetters }, { document = null, headings, chapter = '' }) {
    headings = headings || getters.getTopLevelObjects(document.uid).filter(x => x.isHeading)
    headings
      .forEach((x, index) => {
        const ch = chapter ? `${chapter}.${index + 1}` : `${index + 1}`
        dispatch('objects/setObjectChapter', { object: x, chapter: ch }, { root: true })
        const childrenHeadings = x.objects.map(y => rootGetters['objects/getObjectById'](y)).filter(y => y.isHeading)
        dispatch('calculateChapters', { headings: childrenHeadings, chapter: x.chapter })
      })
  },
  bindDocuments ({ commit }) {
    bindFirestoreCollection(commit, 'documents', collection(db, 'documents'))
  }
}

// mutations
const mutations = {
  openDocument (state, { document }) {
    if (!document) return
    if (!state.openDocuments.includes(document.uid)) state.openDocuments.push(document.uid)
    state.activeDocument = document.uid
  },
  closeDocument (state, { document }) {
    const { openDocuments: od } = state
    const index = od.findIndex(x => x === document.uid)
    if (index === -1) return
    od.splice(index, 1)
    state.activeDocument = od.length > 0 ? od.at(0) : null
  },
  ...vuexMutations
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
