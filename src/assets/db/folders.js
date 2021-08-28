import { v4 as uuidv4 } from 'uuid'
import { projects } from '@/assets/db/projects'

const validationId = uuidv4()

export const folders = [
  {
    uid: uuidv4(),
    name: 'Requirements',
    parentId: projects.at(0).uid
  },
  {
    uid: uuidv4(),
    name: 'Architecture',
    parentId: projects.at(0).uid
  },
  {
    uid: uuidv4(),
    name: 'Validation',
    parentId: projects.at(0).uid
  },
  {
    uid: uuidv4(),
    name: 'Requirements',
    parentId: projects.at(1).uid
  },
  {
    uid: uuidv4(),
    name: 'Architecture',
    parentId: projects.at(1).uid
  },
  {
    uid: validationId,
    name: 'Validation',
    parentId: projects.at(1).uid
  },
  {
    uid: uuidv4(),
    name: 'Nested folder',
    parentId: validationId
  }
]
