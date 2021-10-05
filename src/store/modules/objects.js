import createObject from '@/model/object'
import { db } from '@/firebase'
import { doc, collection, getDoc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore'
import { bindFirestoreCollection, vuexMutations } from '@/vuex-firestore-binding'

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
  getObjectByObjectId: (state) => (documentId, objectId) => {
    return state.objects.find(x => x.documentId === documentId && x.id === objectId)
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
  addObjectAfter ({ dispatch, getters, rootGetters }, { after, object }) {
    const { parentId, documentId, uid } = after

    const parent = getters.getObjectById(parentId)
    const index = parent.objects.indexOf(uid) + 1

    // TODO: have document have max ID
    const id = rootGetters['documents/getNextObjectId'](documentId)
    object = { ...object, id, documentId, parentId }

    dispatch('addObjectToParent', { parent, object, index })
  },
  addObjectBelow ({ dispatch, rootGetters }, { parent, object }) {
    const { documentId, uid: parentId } = parent

    const index = 0
    const id = rootGetters['documents/getNextObjectId'](documentId)
    const document = rootGetters['documents/getDocumentById'](documentId)
    const columns = document.columns.map(x => rootGetters['columns/getColumnById'](x))

    object = {
      ...columns.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.default }), {}),
      id,
      ...object,
      documentId,
      parentId
    }
    dispatch('addObjectToParent', { parent, object, index })
  },
  addFirstObjectToDocument ({ dispatch, rootGetters }, { documentId }) {
    const parent = rootGetters['documents/getRootObject'](documentId)
    const document = rootGetters['documents/getDocumentById'](documentId)
    const columns = document.columns.map(x => rootGetters['columns/getColumnById'](x))
    dispatch('addObjectBelow', {
      parent: parent,
      object: {
        ...createObject(),
        ...columns.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.default }), {}),
        chapter: '1',
        id: 1,
        parentId: parent.uid,
        isHeading: true,
        documentId
      }
    })
  },

  async addRootObject ({ commit }, { documentId }) {
    const object = { ...createObject(), root: true, documentId }
    const docRef = doc(db, 'objects', object.uid)
    await setDoc(docRef, object)
  },
  async removeObject ({ commit }, { object }) {
    const { parentId, uid } = object
    const objRef = doc(db, 'objects', uid)

    if (parentId) {
      const parentRef = doc(db, 'objects', parentId)
      const parent = (await getDoc(parentRef)).data()
      if (parent) {
        const indexInParent = parent.objects.indexOf(uid)
        parent.objects.splice(indexInParent, 1)
        await updateDoc(parentRef, { objects: parent.objects })
      }
    }
    await deleteDoc(objRef)
  },
  async toggleObjectTitle ({ commit }, { object }) {
    const isHeading = !object.isHeading
    const docRef = doc(db, 'objects', object.uid)
    await updateDoc(docRef, { isHeading })
  },
  async setObjectProperty ({ commit }, { object, key, value }) {
    const docRef = doc(db, 'objects', object.uid)
    await updateDoc(docRef, { [key]: value })
  },
  async moveObjectAfter ({ commit }, { after, object }) {
    const oldParentRef = doc(db, 'objects', object.parentId)
    const oldParent = (await getDoc(oldParentRef)).data()
    await updateDoc(oldParentRef, { objects: oldParent.objects.filter(x => x !== object.uid) })

    const newParentRef = doc(db, 'objects', after.uid)
    const newParent = (await getDoc(newParentRef)).data()
    const i = newParent.objects.indexOf(after.uid) + 1
    newParent.objects.splice(i, 0, object.uid)
    await updateDoc(newParentRef, { objects: newParent.objects })

    const objRef = doc(db, 'objects', object.uid)
    await updateDoc(objRef, { parentId: after.parentId })
  },
  async moveObjectBelow ({ commit }, { parent, object }) {
    const oldParentRef = doc(db, 'objects', object.parentId)
    const oldParent = (await getDoc(oldParentRef)).data()
    await updateDoc(oldParentRef, { objects: oldParent.objects.filter(x => x !== object.uid) })

    const newParentRef = doc(db, 'objects', parent.uid)
    const newParent = (await getDoc(newParentRef)).data()
    await updateDoc(newParentRef, { objects: [object.uid, ...newParent.objects] })

    const objRef = doc(db, 'objects', object.uid)
    await updateDoc(objRef, { parentId: parent.uid })
  },
  async addObjectToParent ({ commit }, { parent, object, index }) {
    object = {
      ...createObject(),
      ...object
    }
    const objRef = doc(db, 'objects', object.uid)
    await setDoc(objRef, object)

    const parentRef = doc(db, 'objects', parent.uid)
    const parentObjects = [...parent.objects]
    parentObjects.splice(index, 0, object.uid)
    await updateDoc(parentRef, { objects: parentObjects })
  },
  async setObjectChapter ({ state }, { object, chapter }) {
    const objRef = doc(db, 'objects', object.uid)
    await updateDoc(objRef, { chapter })
  },
  async addExistingObject ({ state }, { object }) {
    const objRef = doc(db, 'objects', object.uid)
    await setDoc(objRef, object)
  },
  bindObjects ({ commit }) {
    bindFirestoreCollection(commit, 'objects', collection(db, 'objects'))
  }
}

// mutations
const mutations = {
  setHoverObject (state, { object }) {
    if (object && state.hoverObject === object.uid) return
    state.hoverObject = object ? object.uid : null
  },
  setActiveObject (state, { object }) {
    if (object && state.activeObject === object.uid) return
    state.activeObject = object ? object.uid : null
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
