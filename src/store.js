import { reactive } from 'vue'
import { users } from '@/assets/db/users'
import { projects } from '@/assets/db/projects'
import { folders } from '@/assets/db/folders'
import { documents } from '@/assets/db/documents'
import { columns } from '@/assets/db/columns'

export default reactive({
  state: {
    users,
    columns,
    projects,
    documents,
    folders
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
    const project = this.state.projects.filter(x => x.uid === projectId).pop()
    if (!project) throw new Error(`Project ${projectId} not found`)
    this.state.folders.push({ ...folder, projectId })
  },
  removeFolderFromProject (projectId, folderId) {
    const project = this.state.projects.filter(x => x.uid === projectId).pop()
    if (!project) throw new Error(`Project ${projectId} not found`)
    const index = this.state.folders.findIndex(x => x.uid === folderId && x.projectId === projectId)
    if (!index) throw new Error(`Folder ${folderId} not found`)
  },
  addObjectToDocument (documentId, index, object) {
    const doc = this.state.documents.filter(x => x.uid === documentId).pop()
    if (!doc) throw new Error(`Document ${documentId} not found`)
    doc.data.splice(index, 0, object)
  },
  removeObjectFromDocument (documentId, objectId) {
    const doc = this.state.documents.filter(x => x.uid === documentId).pop()
    if (!doc) throw new Error(`Document ${documentId} not found`)
    const index = doc.data.findIndex(x => x.uid === objectId)
    if (!index) throw new Error(`Object ${objectId} not found`)
    doc.data.splice(index, 1)
  }
})
