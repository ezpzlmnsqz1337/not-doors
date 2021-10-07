import { users } from '@/assets/db/users'
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth'
import { AvatarGenerator } from 'random-avatar-generator'

const generator = new AvatarGenerator()

const state = () => ({
  users,
  activeUser: null
})

// getters
const getters = {
  getUserById: (state) => (userId) => state.users.find(x => x.uid === userId)
}

// actions
const actions = {
  login ({ commit, dispatch }, { email, password }) {
    const auth = getAuth()
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        console.log('Logged in!')
      })
      .catch(error => {
        console.log('Error when logging in.')
        console.log('Error code: ', error.code, ', error message: ', error.message)
      })
  },
  logout ({ commit }) {
    const auth = getAuth()
    signOut(auth)
      .then(() => {
        commit('setUser', { user: null })
      })
      .catch((error) => {
        console.log('Error when logging out.')
        console.log('Error code: ', error.code, ', error message: ', error.message)
      })
  },
  updateUser () {
    const auth = getAuth()
    const names = auth.currentUser.email.split('@')[0].split('.')
    const firstName = names[0].charAt(0).toUpperCase() + names[0].slice(1)
    const lastName = names[1].charAt(0).toUpperCase() + names[1].slice(1)
    updateProfile(auth.currentUser, {
      displayName: `${firstName} ${lastName}`, photoURL: generator.generateRandomAvatar(auth.currentUser.uid)
    })
  },
  bindUsers ({ commit }) {
    const auth = getAuth()
    onAuthStateChanged(auth, user => commit('setUser', { user }))
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
