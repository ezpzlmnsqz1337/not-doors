import { v4 as uuidv4 } from 'uuid'
import { projects } from '@/assets/db/projects'

export const folders = [
  {
    uid: uuidv4(),
    name: 'Requirements',
    projectId: projects.at(0).uid,
    parentFolderId: 0
  },
  {
    uid: uuidv4(),
    name: 'Architecture',
    projectId: projects.at(0).uid,
    parentFolderId: 0
  },
  {
    uid: uuidv4(),
    name: 'Validation',
    projectId: projects.at(0).uid,
    parentFolderId: 0
  },
  {
    uid: uuidv4(),
    name: 'Requirements',
    projectId: projects.at(0).uid,
    parentFolderId: 0
  },
  {
    uid: uuidv4(),
    name: 'Architecture',
    projectId: projects.at(0).uid,
    parentFolderId: 0
  },
  {
    uid: uuidv4(),
    name: 'Validation',
    projectId: projects.at(0).uid,
    parentFolderId: 0
  }
]
