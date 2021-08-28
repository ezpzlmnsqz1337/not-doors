import { users } from '@/assets/db/users'

const state = () => ({
  users,
  activeUser: users.at(0)
})

// getters
const getters = {
  getUserById: (state) => (userId) => state.users.find(x => x.uid === userId)
}

// actions
const actions = {
  login ({ commit, state }, { email, password }) {
    // fake login for now
    const user = state.users.find(x => x.email === email && x.password === password)
    if (!user) return
    commit('setUser', { user })
  },
  logout ({ commit }) {
    // fake logout for now
    commit('setUser', { user: null })
  }
}

// mutations
const mutations = {
  addUser (state, { user }) {
    state.items.push(user)
  },
  removeUser (state, { user }) {
    const index = state.users.findIndex(x => x.uid === user.uid)
    state.users.splice(index, 1)
  },
  setUser (state, { user }) {
    state.activeUser = user
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
