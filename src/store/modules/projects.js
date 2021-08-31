import { v4 as uuidv4 } from 'uuid'

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
  removeProject ({ commit, dispatch, state, rootGetters }, { project }) {
    if (!project) return
    const index = state.projects.findIndex(x => x.uid === project.uid)
    commit('closeProject', { project })
    rootGetters['folders/getFolders'](project.uid).forEach(x => dispatch('folders/removeFolder', { folder: x }, { root: true }))
    commit('removeProject', { index })
  },
  toggleProject ({ commit, state }, { project }) {
    const isOpen = state.openProjects.includes(project.uid)
    if (!isOpen) {
      commit('openProject', { project })
    } else {
      commit('closeProject', { project })
    }
  }
}

// mutations
const mutations = {
  addProject (state, { name }) {
    state.projects.push({ uid: uuidv4(), name })
  },
  renameProject (state, { project, name }) {
    project.name = name
  },
  removeProject (state, { index }) {
    state.projects.splice(index, 1)
  },
  openProject ({ openProjects }, { project }) {
    if (!project) return
    if (!openProjects.includes(project.uid)) openProjects.push(project.uid)
  },
  closeProject ({ openProjects }, { project }) {
    const index = openProjects.findIndex(x => x === project.uid)
    if (index !== -1) openProjects.splice(index, 1)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
