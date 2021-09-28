import createDocument from '@/model/document'
import { db } from '@/firebase'
import { collection, onSnapshot } from 'firebase/firestore'

const subs = []

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
  async addDocument ({ commit, rootState, dispatch }, { parent, name }) {
    const document = { ...createDocument(), name, parentId: parent.uid, columns: rootState.columns.columns.map(x => x.uid) }
    await db.collection('documents').doc(document.uid)
      .set(document)
    dispatch('bindDocuments')
    // add root object
    commit('objects/addRootObject', { documentId: document.uid }, { root: true })
  },
  async removeDocument ({ commit, dispatch, getters }, { document }) {
    if (!document) return
    commit('closeDocument', { document })
    getters.getDocumentObjects(document.uid).forEach(x => commit('objects/removeObject', { object: x }, { root: true }))
    await db.collection('documents').doc(document.uid)
      .delete()
    dispatch('bindDocuments')
  },
  async renameDocument ({ dispatch }, { document, name }) {
    await db.collection('documents').doc(document.uid)
      .update({ name })
    dispatch('bindDocuments')
  },
  calculateChapters ({ getters, dispatch, commit, rootGetters }, { document = null, headings, chapter = '' }) {
    headings = headings || getters.getTopLevelObjects(document.uid).filter(x => x.isHeading)
    headings
      .forEach((x, index) => {
        const ch = chapter ? `${chapter}.${index + 1}` : `${index + 1}`
        commit('objects/setObjectChapter', { object: x, chapter: ch }, { root: true })
        const childrenHeadings = x.objects.map(y => rootGetters['objects/getObjectById'](y)).filter(y => y.isHeading)
        dispatch('calculateChapters', { headings: childrenHeadings, chapter: x.chapter })
      })
  },
  bindDocuments ({ state }) {
    subs.push({
      name: 'documents',
      unsub: onSnapshot(collection(db, 'documents'),
        snapshot => snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            console.log('New document: ', change.doc.data())
          }
          if (change.type === 'modified') {
            console.log('Modified document: ', change.doc.data())
          }
          if (change.type === 'removed') {
            console.log('Removed document: ', change.doc.data())
          }
        })
      )
    })
  },
  unsubscribe () {
    subs.forEach(x => x.unsub())
    subs.splice(0)
  }
}

// mutations
const mutations = {
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
