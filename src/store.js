import { reactive } from 'vue'
import { users } from '@/assets/db/users'
import { objects } from '@/assets/db/objects'
import { projects } from '@/assets/db/projects'
import { folders } from '@/assets/db/folders'
import { documents } from '@/assets/db/documents'
import { columns } from '@/assets/db/columns'
import eb from '@/eventBus'
import EventType from '@/constants/EventType'
import MenuItem from './constants/MenuItem'
import { v4 as uuidv4 } from 'uuid'

export default reactive({
  state: {
    users,
    columns,
    projects,
    documents,
    folders,
    objects,
    openProjects: [],
    openFolders: [],
    openDocuments: [],
    activeDocument: null,
    activeObject: null,
    activeMenuContent: MenuItem.PROJECTS,
    menuItems: [
      { id: MenuItem.PROJECTS, name: 'Projects', icon: 'folder', activeDocument: false },
      { id: MenuItem.CONTENT, name: 'Content', icon: 'list', activeDocument: true }
    ]
  },
  addProject (name) {
    this.state.projects.push({ uid: uuidv4(), name })
  },
  removeProject (projectId) {
    const index = this.state.projects.findIndex(x => x.uid === projectId)
    if (index === -1) throw new Error(`Project ${projectId} not found`)
    this.state.folders.filter(x => x.projectId === projectId).forEach(x => this.removeFolder(x.uid))
    this.state.projects.splice(index, 1)
  },
  addFolderToProject (projectId, name) {
    this.state.folders.push({ uid: uuidv4(), name, projectId })
  },
  removeFolder (folderId) {
    const index = this.state.folders.findIndex(x => x.uid === folderId)
    if (index === -1) throw new Error(`Folder ${folderId} not found`)
    this.state.documents.filter(x => x.folderId === folderId).forEach(x => this.removeDocument(x.uid))
    this.state.folders.splice(index, 1)
  },
  addDocumentToFolder (folderId, name) {
    this.state.documents.push({ uid: uuidv4(), name, folderId })
  },
  removeDocument (documentId) {
    const index = this.state.documents.findIndex(x => x.uid === documentId)
    if (index === -1) throw new Error(`Document ${document} not found`)
    this.state.documents.splice(index, 1)
  },
  addObjectToDocument (documentId, object) {
    const id = this.state.objects
      .filter(x => x.documentId === documentId)
      .reduce((acc, { id: curr }) => curr > acc ? curr : acc, 0) + 1
    this.state.objects.push({ uid: uuidv4(), id, ...object, documentId })
  },
  removeObjectFromDocument (documentId, objectId) {
    const doc = this.findDocument(documentId)
    const index = doc.data.findIndex(x => x.uid === objectId)
    if (index === -1) throw new Error(`Object ${objectId} not found`)
    doc.data.splice(index, 1)
  },
  findProject (projectId) {
    const project = this.state.projects.filter(x => x.uid === projectId).pop()
    if (!project) throw new Error(`Project ${projectId} not found`)
    return project
  },
  findFolder (folderId) {
    const folder = this.state.folders.filter(x => x.uid === folderId).pop()
    if (!folder) throw new Error(`Folder ${folderId} not found`)
    return folder
  },
  findDocument (documentId) {
    const doc = this.state.documents.filter(x => x.uid === documentId).pop()
    if (!doc) throw new Error(`Document ${documentId} not found`)
    return doc
  },
  openProject (projectId) {
    const openProjects = this.state.openProjects
    const index = openProjects.findIndex(x => x === projectId)
    if (index === -1) openProjects.push(projectId)
  },
  closeProject (projectId) {
    const openProjects = this.state.openProjects
    const index = openProjects.findIndex(x => x === projectId)
    if (index !== -1) openProjects.splice(index, 1)
  },
  openFolder (folderId) {
    const openFolders = this.state.openFolders
    const index = openFolders.findIndex(x => x === folderId)
    if (index === -1) openFolders.push(folderId)
  },
  closeFolder (folderId) {
    const openFolders = this.state.openFolders
    const index = openFolders.findIndex(x => x === folderId)
    if (index !== -1) openFolders.splice(index, 1)
  },
  openDocument (documentId) {
    const od = this.state.openDocuments.map(x => x.uid)
    const doc = this.findDocument(documentId)
    if (!od.includes(documentId)) this.state.openDocuments.push(doc)
    this.state.activeDocument = doc
    eb.emit(EventType.OPEN_DOCUMENT, doc)
  },
  closeDocument (documentId) {
    const index = this.state.openDocuments.findIndex(x => x.uid === documentId)
    this.state.openDocuments.splice(index, 1)
    this.state.activeDocument = this.state.openDocuments[0]
  },
  setActiveMenuContent (type) {
    this.state.activeMenuContent = type
  },
  getMenuItem (id) {
    const item = this.state.menuItems.filter(x => x.id === id).pop()
    if (!item) throw new Error(`Menu item ${id} not found!`)
    return item
  },
  findObject (objectId) {
    const obj = this.state.objects.filter(x => x.uid === objectId).pop()
    if (!obj) throw new Error(`Object ${objectId} not found`)
    return obj
  },
  setActiveObject (object) {
    this.state.activeObject = object
  },
  findColumn (columnId) {
    const column = this.state.columns.filter(x => x.uid === columnId).pop()
    if (!column) throw new Error(`Column ${columnId} not found`)
    return column
  },
  calculateChapters (documentId) {
    // get document objects
    const objects = this.state.objects.filter(x => x.documentId === documentId && x.isHeading)
    // get root objects
    this.calculateChaptersDeep(objects)
  },
  calculateChaptersDeep (objects, parentId = 0, chapter = '') {
    console.log('CH: ', chapter)
    objects
      .filter(x => x.parentId === parentId)
      .sort((a, b) => a.order - b.order)
      .forEach((x, index) => {
        x.chapter = chapter ? `${chapter}.${index + 1}` : `${index + 1}`
        this.calculateChaptersDeep(objects, x.uid, x.chapter)
      })
  }
})
