const state = () => ({
  panels: [{
    name: 'menu',
    width: 320
  }]
})

// getters
const getters = {
  getPanelByName: (state) => (panelName) => state.panels.find(x => x.name === panelName)
}

// actions
const actions = {
  setPanelWidth ({ commit, getters }, { panelName, width }) {
    const panel = getters.getPanelByName(panelName)
    if (!panel) return
    commit('setPanelWidth', { panel, width })
  }
}

// mutations
const mutations = {
  setPanelWidth (state, { panel, width }) {
    panel.width = width
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
