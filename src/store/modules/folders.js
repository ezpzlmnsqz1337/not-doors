import { v4 as uuidv4 } from 'uuid'

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
  removeFolder ({ commit, dispatch, getters, state, rootGetters }, { folder }) {
    if (!folder) return
    const index = state.folders.findIndex(x => x.uid === folder.uid)
    commit('closeFolder', { folder })
    getters.getFolders(folder.uid).forEach(x => dispatch('removeFolder', { folder: x }))
    rootGetters['documents/getDocuments'](folder.uid)
      .forEach(x => dispatch('documents/removeDocument', { document: x }, { root: true }))
    commit('removeFolder', { index })
  },
  toggleFolder ({ commit, state }, { folder }) {
    const isOpen = state.openFolders.includes(folder.uid)
    if (!isOpen) {
      commit('openFolder', { folder })
    } else {
      commit('closeFolder', { folder })
    }
  }
}

// mutations
const mutations = {
  addFolder (state, { parent, name }) {
    state.folders.push({ uid: uuidv4(), name, parentId: parent.uid })
  },
  renameFolder (state, { folder, name }) {
    folder.name = name
  },
  removeFolder (state, { index }) {
    state.folders.splice(index, 1)
  },
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
