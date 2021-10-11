import { v4 as uuidv4 } from 'uuid'
import createObject from '@/model/object'
import createTemplate from '@/model/template'
import { db } from '@/firebase'
import { doc, collection, setDoc } from 'firebase/firestore'
import { bindFirestoreCollection, vuexMutations } from '@/vuex-firestore-binding'

const state = () => ({
  templates: []
})

// getters
const getters = {
  getTemplateById: (state) => (templateId) => state.templates.find(x => x.uid === templateId)
}

// actions
const actions = {
  async createTemplate ({ commit, dispatch, getters, rootGetters }, { name, description, documentId }) {
    const objects = rootGetters['documents/getSortedObjects'](documentId)
    const refreshed = await dispatch('refreshIdentifiers', { objects })
    const template = { ...createTemplate(), name, description, objects: refreshed }
    const docRef = doc(db, 'templates', template.uid)
    await setDoc(docRef, template)
  },
  async createDocumentFromTemplate ({ commit, dispatch, getters, rootGetters }, { documentId, templateId }) {
    const parent = rootGetters['documents/getRootObject'](documentId)
    console.log('parent', parent)
    const template = getters.getTemplateById(templateId)
    const refreshed = await dispatch('refreshIdentifiers', { objects: template.objects })
    refreshed.sort((a, b) => b.id - a.id)
      .forEach(async x => {
        x.documentId = documentId
        if (!x.parentId) {
          await dispatch('objects/addObjectBelow', { parent, object: x }, { root: true })
        } else {
          await dispatch('objects/addExistingObject', { object: x }, { root: true })
        }
      })
  },
  async refreshIdentifiers ({ state }, { objects }) {
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
  },
  bindTemplates ({ commit }) {
    bindFirestoreCollection(commit, 'templates', collection(db, 'templates'))
  }
}

// mutations
const mutations = {
  ...vuexMutations
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
