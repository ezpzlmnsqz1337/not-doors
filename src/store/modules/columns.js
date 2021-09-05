import createColumn from '@/model/column'
import { columns } from '@/assets/db/columns'

const state = () => ({
  columns
})

// getters
const getters = {
  getColumnById: (state) => (columnId) => {
    return state.columns.find(x => x.uid === columnId)
  }
}

// actions
const actions = {
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
