import { v4 as uuidv4 } from 'uuid'

const state = () => ({
  objects: [],
  activeObject: null,
  hoverObject: null
})

// getters
const getters = {
  getObjectById: (state) => (objectId) => {
    return state.objects.find(x => x.uid === objectId)
  },
  getActiveObject: (state, getters) => () => {
    return getters.getObjectById(state.activeObject)
  },
  getObjectChildren: (state, getters) => (objects) => {
    return objects
      .reduce((acc, cur) => [...acc, cur,
        ...getters.getObjectChildren(cur.objects.map(x => getters.getObjectById(x)))
      ], [])
  }
}

// actions
const actions = {
  addObjectAfter ({ commit, getters, rootGetters }, { after, object }) {
    const { parentId, documentId, uid } = after

    const parent = getters.getObjectById(parentId)
    const index = parent.objects.indexOf(uid) + 1

    // TODO: have document have max ID
    const id = rootGetters['documents/getNextObjectId'](documentId)
    object = { ...object, id, documentId, parentId }

    commit('addObjectToParent', { parent, object, index })
  },
  addObjectBelow ({ commit, getters, rootGetters }, { parent, object }) {
    const { documentId, uid: parentId } = parent

    const index = 0
    const id = rootGetters['documents/getNextObjectId'](documentId)

    object = { ...object, id, documentId, parentId }
    commit('addObjectToParent', { parent, object, index })
  },
  addFirstObjectToDocument ({ dispatch, rootGetters }, { documentId }) {
    const parent = rootGetters['documents/getRootObject'](documentId)
    dispatch('addObjectBelow', {
      parent: parent,
      object: {
        uid: uuidv4(),
        chapter: '1',
        id: 1,
        parentId: parent.uid,
        isHeading: true,
        documentId,
        classification: [],
        objects: [],
        type: 'PROSE',
        text: 'Dummy text'
      }
    })
  }
}

// mutations
const mutations = {
  addRootObject (state, { documentId }) {
    state.objects.push({ uid: uuidv4(), root: true, objects: [], documentId })
  },
  removeObject (state, { object }) {
    const { parentId, uid } = object
    const parent = state.objects.find(x => x.uid === parentId)

    const indexInParent = parent.objects.indexOf(uid)
    parent.objects.splice(indexInParent, 1)

    const index = state.objects.findIndex(x => x.uid === uid)
    state.objects.splice(index, 1)
  },
  toggleObjectTitle (state, { object }) {
    object.isHeading = !object.isHeading
  },
  setObjectProperty (state, { object, key, value }) {
    object[key] = value
  },
  moveObjectAfter (state, { after, object }) {
    const oldParent = state.objects.find(x => x.uid === object.parentId)
    const i1 = oldParent.objects.indexOf(object.uid)
    oldParent.objects.splice(i1, 1)

    const newParent = state.objects.find(x => x.uid === after.parentId)
    const i2 = newParent.objects.indexOf(after.uid) + 1
    newParent.objects.splice(i2, 0, object.uid)

    object.parentId = after.parentId
  },
  moveObjectBelow (state, { below, object }) {
    const oldParent = state.objects.find(x => x.uid === object.parentId)
    const i1 = oldParent.objects.indexOf(object.uid)
    oldParent.objects.splice(i1, 1)

    below.objects.splice(0, 0, object.uid)
    object.parentId = below.uid
  },
  addObjectToParent (state, { parent, object, index }) {
    object = {
      ...object,
      uid: uuidv4(),
      classification: [],
      isHeading: false,
      objects: []
    }
    state.objects.push(object)
    parent.objects.splice(index, 0, object.uid)
  },
  setObjectChapter (state, { object, chapter }) {
    object.chapter = chapter
  },
  setHoverObject (state, { object }) {
    if (object && state.hoverObject === object.uid) return
    state.hoverObject = object ? object.uid : null
  },
  setActiveObject (state, { object }) {
    if (object && state.activeObject === object.uid) return
    state.activeObject = object ? object.uid : null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
