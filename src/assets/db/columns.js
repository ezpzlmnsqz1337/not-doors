
import ColumnType from '@/constants/ColumnType'
import { v4 as uuidv4 } from 'uuid'

export const columns = [
  {
    uid: uuidv4(),
    displayName: 'ID',
    name: 'id',
    type: ColumnType.NUMBER,
    default: 0,
    width: 50
  },
  {
    uid: uuidv4(),
    displayName: 'Type',
    name: 'type',
    type: ColumnType.ENUM,
    multiple: false,
    values: ['DEF', 'RDEF', 'REAL', 'PROSE'],
    default: 'PROSE',
    width: 80
  },
  {
    uid: uuidv4(),
    displayName: 'Text',
    name: 'text',
    type: ColumnType.TEXT,
    default: 'Object text',
    width: 620
  },
  {
    uid: uuidv4(),
    displayName: 'Classification',
    name: 'classification',
    type: ColumnType.ENUM,
    multiple: true,
    values: ['Safety-related', 'Security', 'Functional', 'Non-functional', 'Future'],
    default: [],
    width: 150
  }
]
