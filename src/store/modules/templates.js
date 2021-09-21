import { v4 as uuidv4 } from 'uuid'
import createObject from '@/model/object'

const state = () => ({
  templates: []
})

// getters
const getters = {
  getTemplateById: (state) => (templateId) => state.templates.find(x => x.uid === templateId)
}

// actions
const actions = {
  createTemplate ({ commit, dispatch, getters, rootGetters }, { name, description, documentId }) {
    const objects = dispatch('refreshIdentifiers', { documentId })

    const template = { name, description, objects }
    commit('addTemplate', { template })
  },
  refreshIdentifiers ({ rootGetters }, { documentId }) {
    let id = 1
    const objects = rootGetters['documents/getSortedObjects'](documentId)
      .map(x => ({ ...createObject(), ...x }))
    objects.forEach(x => (x.id = id++))
    console.log(objects)

    objects.forEach(x => {
      // create uuid
      const uuid = uuidv4()
      // replace object id in parent
      const parent = objects.find(y => y.uid === x.parentId)
      if (parent) {
        parent.objects = [...parent.objects]
        parent.objects.splice(parent.objects.indexOf(x.uid), 1, uuid)
      }
      // replace parent id in children
      x.objects = [...x.objects]
      x.objects.forEach(y => {
        const child = objects.find(z => z.uid === y)
        if (child) child.parentId = uuid
      })
      // replace own uid
      x.uid = uuid
    })
    return objects
  }
}

// mutations
const mutations = {
  addTemplate (state, { template }) {
    state.templates.push(template)
    console.log(state.templates)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
