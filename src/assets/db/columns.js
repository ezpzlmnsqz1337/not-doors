export const columns = [
  {
    uid: 1,
    displayName: 'ID',
    name: 'id',
    type: 'number'
  },
  {
    uid: 2,
    displayName: 'Type',
    name: 'type',
    type: 'enum',
    multiple: false,
    values: ['DEF', 'RDEF', 'REAL', 'PROSE']
  },
  {
    uid: 3,
    displayName: 'Text',
    name: 'text',
    type: 'string'
  },
  {
    uid: 4,
    displayName: 'Classification',
    name: 'classification',
    type: 'enum',
    multiple: true,
    values: ['Safety-related', 'Security', 'Functional', 'Non-functional', 'Future']
  }
]
