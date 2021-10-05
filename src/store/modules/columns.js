import createColumn from '@/model/column'
import { db } from '@/firebase'
import { collection } from 'firebase/firestore'
import { bindFirestoreCollection, vuexMutations } from '@/vuex-firestore-binding'

const state = () => ({
  columns: []
})

// getters
const getters = {
  getColumnById: (state) => (columnId) => {
    return state.columns.find(x => x.uid === columnId)
  }
}

// actions
const actions = {
  bindColumns ({ commit }) {
    bindFirestoreCollection(commit, 'columns', collection(db, 'columns'))
  }
}

// mutations
const mutations = {
  addColumn (state, { column }) {
    state.columns.push({
      ...createColumn(),
      ...column
    })
  },
  removeColumn (state, { column }) {
    const index = state.columns.findIndex(x => x.uid === column.uid)
    if (index !== -1) state.columns.splice(index, 1)
  },
  setColumnWidth (state, { column, width }) {
    column.width = width
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
