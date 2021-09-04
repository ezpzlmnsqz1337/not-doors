import { createStore, createLogger } from 'vuex'
import users from '@/store/modules/users'
import objects from '@/store/modules/objects'
import documents from '@/store/modules/documents'
import folders from '@/store/modules/folders'
import projects from '@/store/modules/projects'
import MenuItem from '@/constants/MenuItem'
import { columns } from '@/assets/db/columns'
import createPersistedState from 'vuex-persistedstate'

const debug = process.env.NODE_ENV !== 'production'

const logger = createLogger({
  filter (mutation, stateBefore, stateAfter) {
    return !(mutation.type).includes('setHoverObject')
  }
})

export default createStore({
  modules: {
    users,
    objects,
    documents,
    folders,
    projects
  },
  state: {
    columns,
    activeMenuContent: MenuItem.PROJECTS,
    actionList: [],
    menuItems: [
      { id: MenuItem.PROJECTS, name: 'Projects', icon: 'folder', activeDocument: false },
      { id: MenuItem.CONTENT, name: 'Content', icon: 'list', activeDocument: true }
    ]
  },
  getters: {
    getMenuItemById: (state) => (id) => {
      return state.menuItems.find(x => x.id === id)
    },
    getColumnById: (state) => (columnId) => {
      return state.columns.find(x => x.uid === columnId)
    }
  },
  mutations: {
    setActiveMenuContent (state, { type }) {
      state.activeMenuContent = type
    },
    setColumnWidth (state, { column, width }) {
      column.width = width
    },
    setActionList (state, { actions }) {
      state.actionList = actions
    }
  },
  actions: {},
  strict: debug,
  plugins: debug ? [logger, createPersistedState()] : []
})
