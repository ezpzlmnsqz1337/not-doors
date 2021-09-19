import { createStore, createLogger } from 'vuex'
import users from '@/store/modules/users'
import panels from '@/store/modules/panels'
import objects from '@/store/modules/objects'
import documents from '@/store/modules/documents'
import folders from '@/store/modules/folders'
import projects from '@/store/modules/projects'
import columns from '@/store/modules/columns'
import MenuItem from '@/constants/MenuItem'
import createPersistedState from 'vuex-persistedstate'

const debug = process.env.NODE_ENV !== 'production'

const logger = createLogger({
  filter (mutation, stateBefore, stateAfter) {
    return !(mutation.type).includes('setHoverObject') && !(mutation.type).includes('setPanelWidth') && !(mutation.type).includes('setColumnWidth')
  },
  actionFilter (action, state) {
    return !(action.type).includes('setPanelWidth')
  }
})

export default createStore({
  modules: {
    users,
    objects,
    documents,
    folders,
    projects,
    columns,
    panels
  },
  state: {
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
    }
  },
  mutations: {
    setActiveMenuContent (state, { type }) {
      state.activeMenuContent = type
    },
    setActionList (state, { actions }) {
      state.actionList = actions
    }
  },
  actions: {},
  strict: debug,
  plugins: debug ? [logger, createPersistedState()] : []
})
