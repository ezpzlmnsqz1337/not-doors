import { v4 as uuidv4 } from 'uuid'
import createObject from '@/model/object'
import createTemplate from '@/model/template'

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
    const objects = rootGetters['documents/getSortedObjects'](documentId)
    dispatch('refreshIdentifiers', { objects }).then(refreshed => {
      const template = { name, description, objects: refreshed }
      commit('addTemplate', { template })
    })
  },
  createDocumentFromTemplate ({ commit, dispatch, getters, rootGetters }, { documentId, templateId }) {
    const parent = rootGetters['documents/getRootObject'](documentId)
    console.log('parent', parent)
    const template = getters.getTemplateById(templateId)
    dispatch('refreshIdentifiers', { objects: template.objects }).then(refreshed => {
      refreshed.sort((a, b) => b.id - a.id)
        .forEach(x => {
          x.documentId = documentId
          if (!x.parentId) {
            dispatch('objects/addObjectBelow', { parent, object: x }, { root: true })
          } else {
            commit('objects/addExistingObject', { object: x }, { root: true })
          }
        })
    })
  },
  refreshIdentifiers ({ state }, { objects }) {
    let id = 1
    objects = objects.map(x => ({ ...createObject(), ...x, documentId: null, id: id++ }))
    console.log(objects)

    objects.forEach(x => {
      // create uuid
      const uuid = uuidv4()
      // replace object id in parent
      const parent = objects.find(y => y.uid === x.parentId)
      if (parent) {
        parent.objects = [...parent.objects]
        parent.objects.splice(parent.objects.indexOf(x.uid), 1, uuid)
      } else {
        x.parentId = null
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
    state.templates.push({ ...createTemplate(), ...template })
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
