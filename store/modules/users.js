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

}

// mutations
const mutations = {
  addUser (state, user) {
    state.items.push(user)
  },

  removeUser (state, userId) {
    const index = state.users.findIndex(x => x.uid === userId)
    state.users.splice(index, 1)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
