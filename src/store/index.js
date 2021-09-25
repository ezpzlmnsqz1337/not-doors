import MenuItem from '@/constants/MenuItem'
import columns from '@/store/modules/columns'
import documents from '@/store/modules/documents'
import folders from '@/store/modules/folders'
import objects from '@/store/modules/objects'
import panels from '@/store/modules/panels'
import projects from '@/store/modules/projects'
import templates from '@/store/modules/templates'
import users from '@/store/modules/users'
import { createLogger, createStore } from 'vuex'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { db } from '@/firebase'

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
    panels,
    templates
  },
  state: {
    activeMenuContent: MenuItem.PROJECTS,
    actionList: [],
    menuItems: [
      { id: MenuItem.PROJECTS, name: 'Projects', icon: 'folder', activeDocument: false },
      { id: MenuItem.CONTENT, name: 'Content', icon: 'list', activeDocument: true }
    ],
    stuff: []
  },
  getters: {
    getMenuItemById: (state) => (id) => {
      return state.menuItems.find(x => x.id === id)
    },
    getStuff: (state) => () => {
      return state.stuff
    }
  },
  mutations: {
    setActiveMenuContent (state, { type }) {
      state.activeMenuContent = type
    },
    setActionList (state, { actions }) {
      state.actionList = actions
    },
    ...vuexfireMutations
  },
  actions: {
    bindStuff: firestoreAction(({ bindFirestoreRef }) => {
      // return the promise returned by `bindFirestoreRef`
      return bindFirestoreRef('stuff', db.collection('stuff'), { wait: true })
    }),
    addStuff: firestoreAction(({ bindFirestoreRef }) => {
      // return the promise returned by `bindFirestoreRef`
      return db.collection('stuff').doc('penis' + Math.random())
        .set({ name: 'huge', easy: 'yes' })
    })
  },
  strict: debug,
  plugins: debug ? [logger] : []
})
