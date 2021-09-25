import createFolder from '@/model/folder'
import { db } from '@/firebase'
import { firestoreAction } from 'vuexfire'

const state = () => ({
  folders: [],
  openFolders: []
})

// getters
const getters = {
  getFolderById: (state) => (folderId) => {
    return state.folders.find(x => x.uid === folderId)
  },
  getFolders: (state) => (parentId) => {
    return state.folders.filter(x => x.parentId === parentId)
  }
}

// actions
const actions = {
  removeFolder: firestoreAction(async ({ commit, dispatch, getters, rootGetters }, { folder, name }) => {
    if (!folder) return
    commit('closeFolder', { folder })
    getters.getFolders(folder.uid).forEach(x => dispatch('removeFolder', { folder: x }))
    rootGetters['documents/getDocuments'](folder.uid)
      .forEach(x => dispatch('documents/removeDocument', { document: x }, { root: true }))
    await db.collection('folders').doc(folder.uid)
      .delete()
    dispatch('bindFolders')
  }),
  renameFolder: firestoreAction(async ({ dispatch }, { folder, name }) => {
    await db.collection('folders').doc(folder.uid)
      .update({ name })
    dispatch('bindFolders')
  }),
  addFolder: firestoreAction(async ({ dispatch }, { name, parent }) => {
    const folder = { ...createFolder(), name, parentId: parent.uid }
    await db.collection('folders').doc(folder.uid)
      .set(folder)
    dispatch('bindFolders')
  }),
  toggleFolder ({ commit, state }, { folder }) {
    const isOpen = state.openFolders.includes(folder.uid)
    if (!isOpen) {
      commit('openFolder', { folder })
    } else {
      commit('closeFolder', { folder })
    }
  },
  bindFolders: firestoreAction(({ bindFirestoreRef }) => {
    // return the promise returned by `bindFirestoreRef`
    return bindFirestoreRef('folders', db.collection('folders'))
  })
}

// mutations
const mutations = {
  openFolder ({ openFolders }, { folder }) {
    if (!folder) return
    if (!openFolders.includes(folder.uid)) openFolders.push(folder.uid)
  },
  closeFolder ({ openFolders }, { folder }) {
    const index = openFolders.findIndex(x => x === folder.uid)
    if (index !== -1) openFolders.splice(index, 1)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
