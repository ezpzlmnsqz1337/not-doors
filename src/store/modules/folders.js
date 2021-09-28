import createFolder from '@/model/folder'
import { db } from '@/firebase'
import { collection, doc, deleteDoc, updateDoc, setDoc, query, where, getDocs } from 'firebase/firestore'
import { bindFirestoreCollection, vuexMutations } from '@/vuex-firestore-binding'

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
  async removeFolder ({ commit, dispatch, getters, rootGetters }, { folder }) {
    if (!folder) return
    commit('closeFolder', { folder })
    const queryFolders = query(collection(db, 'folders'), where('parentId', '==', folder.uid))
    const folderFolders = await getDocs(queryFolders)
    folderFolders.forEach(x => dispatch('removeFolder', { folder: x }))

    const queryDocuments = query(collection(db, 'documents'), where('parentId', '==', folder.uid))
    const folderDocuments = await getDocs(queryDocuments)
    folderDocuments.forEach(x => dispatch('documents/removeDocument', { document: x }, { root: true }))
    await deleteDoc(doc(db, 'folders', folder.uid))
  },
  async renameFolder ({ dispatch }, { folder, name }) {
    await updateDoc(doc(db, 'folders', folder.uid), { name })
  },
  async addFolder ({ dispatch }, { name, parent }) {
    const folder = { ...createFolder(), name, parentId: parent.uid }
    setDoc(doc(db, 'folders', folder.uid), folder)
  },
  toggleFolder ({ commit, state }, { folder }) {
    const isOpen = state.openFolders.includes(folder.uid)
    if (!isOpen) {
      commit('openFolder', { folder })
    } else {
      commit('closeFolder', { folder })
    }
  },
  bindFolders ({ commit }) {
    bindFirestoreCollection(commit, 'folders', collection(db, 'folders'))
  }
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
