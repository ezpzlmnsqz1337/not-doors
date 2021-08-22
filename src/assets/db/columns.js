
import { v4 as uuidv4 } from 'uuid'

export const columns = [
  {
    uid: uuidv4(),
    displayName: 'ID',
    name: 'id',
    type: 'number'
  },
  {
    uid: uuidv4(),
    displayName: 'Type',
    name: 'type',
    type: 'enum',
    multiple: false,
    values: ['DEF', 'RDEF', 'REAL', 'PROSE']
  },
  {
    uid: uuidv4(),
    displayName: 'Text',
    name: 'text',
    type: 'string'
  },
  {
    uid: uuidv4(),
    displayName: 'Classification',
    name: 'classification',
    type: 'enum',
    multiple: true,
    values: ['Safety-related', 'Security', 'Functional', 'Non-functional', 'Future']
  }
]
