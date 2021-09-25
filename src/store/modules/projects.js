import createProject from '@/model/project'
import { db } from '@/firebase'
import { firestoreAction } from 'vuexfire'

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
  removeProject: firestoreAction(async ({ commit, dispatch, state, rootGetters }, { project }) => {
    if (!project) return
    commit('closeProject', { project })
    rootGetters['folders/getFolders'](project.uid).forEach(x => dispatch('folders/removeFolder', { folder: x }, { root: true }))

    await db.collection('projects').doc(project.uid)
      .delete()
    dispatch('bindProjects')
  }),
  renameProject: firestoreAction(async ({ dispatch }, { project, name }) => {
    await db.collection('projects').doc(project.uid)
      .update({ name })
    dispatch('bindProjects')
  }),
  toggleProject ({ commit, state }, { project }) {
    const isOpen = state.openProjects.includes(project.uid)
    if (!isOpen) {
      commit('openProject', { project })
    } else {
      commit('closeProject', { project })
    }
  },
  addProject: firestoreAction(async ({ dispatch }, { name }) => {
    const project = { ...createProject(), name }
    await db.collection('projects').doc(project.uid)
      .set(project)
    dispatch('bindProjects')
  }),
  bindProjects: firestoreAction(({ bindFirestoreRef }) => {
    // return the promise returned by `bindFirestoreRef`
    return bindFirestoreRef('projects', db.collection('projects'))
  })
}

// mutations
const mutations = {
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
