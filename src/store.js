import { reactive } from 'vue'
import { users } from '@/assets/db/users'
import { objects } from '@/assets/db/objects'
import { projects } from '@/assets/db/projects'
import { folders } from '@/assets/db/folders'
import { documents } from '@/assets/db/documents'
import { columns } from '@/assets/db/columns'
import eb from '@/eventBus'
import EventType from '@/constants/EventType'

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
    activeMenuContent: 'projects'
  },
  addProject ({ name }) {
    const uid = Math.max(this.state.projects.map(x => x.uid))
    this.state.projects.push({ uid, name })
  },
  removeProject (projectId) {
    const index = this.state.projects.findIndex(x => x.uid === projectId)
    if (!index) throw new Error(`Project ${projectId} not found`)
    this.state.projects.splice(index, 1)
  },
  addFolderToProject (projectId, folder) {
    const project = this.findProject(projectId)
    if (!project) throw new Error(`Project ${projectId} not found`)
    this.state.folders.push({ ...folder, projectId })
  },
  removeFolderFromProject (projectId, folderId) {
    const index = this.state.folders.findIndex(x => x.uid === folderId && x.projectId === projectId)
    if (!index) throw new Error(`Folder ${folderId} not found`)
  },
  addObjectToDocument (documentId, index, object) {
    const doc = this.findDocument(documentId)
    doc.data.splice(index, 0, object)
  },
  removeObjectFromDocument (documentId, objectId) {
    const doc = this.findDocument(documentId)
    const index = doc.data.findIndex(x => x.uid === objectId)
    if (!index) throw new Error(`Object ${objectId} not found`)
    doc.data.splice(index, 1)
  },
  findProject (projectId) {
    const project = this.state.projects.filter(x => x.uid === projectId).pop()
    if (!project) throw new Error(`Project ${projectId} not found`)
    return project
  },
  findDocument (documentId) {
    const doc = this.state.documents.filter(x => x.uid === documentId).pop()
    if (!doc) throw new Error(`Document ${documentId} not found`)
    return doc
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
  }
})
