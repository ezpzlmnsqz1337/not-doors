import createProject from '@/model/project'
import { db } from '@/firebase'
import { doc, query, where, collection, getDocs, deleteDoc, updateDoc, setDoc } from 'firebase/firestore'
import { bindFirestoreCollection, vuexMutations } from '@/vuex-firestore-binding'

const state = () => ({
  projects: [],
  openProjects: []
})

// getters
const getters = {
  getProjectById: (state) => (projectId) => {
    return state.projects.find(x => x.uid === projectId)
  }
}

// actions
const actions = {
  async removeProject ({ commit, dispatch }, { project }) {
    if (!project) return
    commit('closeProject', { project })
    const q = query(collection(db, 'folders'), where('parentId', '==', project.uid))
    const projectFolders = await getDocs(q)
    projectFolders.forEach(x => dispatch('folders/removeFolder', { folder: x.data() }, { root: true }))

    await deleteDoc(doc(db, 'projects', project.uid))
  },
  async renameProject ({ dispatch }, { project, name }) {
    const docRef = doc(db, 'projects', project.uid)
    await updateDoc(docRef, { name })
  },
  toggleProject ({ commit, state }, { project }) {
    const isOpen = state.openProjects.includes(project.uid)
    if (!isOpen) {
      commit('openProject', { project })
    } else {
      commit('closeProject', { project })
    }
  },
  async addProject ({ dispatch }, { name }) {
    const project = { ...createProject(), name }
    const docRef = doc(db, 'projects', project.uid)
    await setDoc(docRef, project)
  },
  bindProjects ({ commit }) {
    bindFirestoreCollection(commit, 'projects', collection(db, 'projects'))
  }
}

// mutations
const mutations = {
  openProject ({ openProjects }, { project }) {
    if (!project) return
    if (!openProjects.includes(project.uid)) openProjects.push(project.uid)
  },
  closeProject ({ openProjects }, { project }) {
    const index = openProjects.findIndex(x => x === project.uid)
    if (index !== -1) openProjects.splice(index, 1)
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
