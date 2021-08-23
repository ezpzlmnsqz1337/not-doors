
import { v4 as uuidv4 } from 'uuid'

export const columns = [
  {
    uid: uuidv4(),
    displayName: 'ID',
    name: 'id',
    type: 'number',
    width: 150
  },
  {
    uid: uuidv4(),
    displayName: 'Type',
    name: 'type',
    type: 'enum',
    multiple: false,
    values: ['DEF', 'RDEF', 'REAL', 'PROSE'],
    width: 150
  },
  {
    uid: uuidv4(),
    displayName: 'Text',
    name: 'text',
    type: 'string',
    width: 150
  },
  {
    uid: uuidv4(),
    displayName: 'Classification',
    name: 'classification',
    type: 'enum',
    multiple: true,
    values: ['Safety-related', 'Security', 'Functional', 'Non-functional', 'Future'],
    width: 150
  }
]
