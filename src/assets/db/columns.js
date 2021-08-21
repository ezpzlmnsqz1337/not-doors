export const columns = [
  {
    uid: 1,
    name: 'ID',
    type: 'number'
  },
  {
    uid: 2,
    name: 'Type',
    type: 'enum',
    multiple: false,
    values: ['DEF', 'RDEF', 'REAL', 'PROSE']
  },
  {
    uid: 3,
    name: 'Text',
    type: 'string'
  },
  {
    uid: 4,
    name: 'Classification',
    type: 'enum',
    multiple: true,
    values: ['Safety-related', 'Security', 'Functional', 'Non-functional', 'Future']
  }
]
