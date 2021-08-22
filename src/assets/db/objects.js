export const objects = [
  {
    id: 0,
    order: 1,
    projectId: 1,
    documentId: 1,
    type: 'PROSE',
    text: 'My first chapter',
    classification: [],
    isHeading: true,
    chapter: 1,
    parentId: 0
  },
  {
    id: 1,
    order: 2,
    projectId: 1,
    documentId: 1,
    type: 'PROSE',
    text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Quisque tincidunt scelerisque libero. In dapibus augue non sapien. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed vel lectus.',
    classification: [],
    isHeading: false,
    chapter: 1,
    parentId: 1
  },
  {
    id: 2,
    order: 3,
    projectId: 1,
    documentId: 1,
    type: 'PROSE',
    text: 'Maecenas sollicitudin. Mauris suscipit, ligula sit amet pharetra semper, nibh ante cursus purus, vel sagittis velit mauris vel metus.',
    classification: [],
    isHeading: false,
    chapter: 1,
    parentId: 1
  },
  {
    id: 3,
    order: 4,
    projectId: 1,
    documentId: 1,
    type: 'PROSE',
    text: 'My second chapter',
    classification: [],
    isHeading: true,
    chapter: 2,
    parentId: 0
  },
  {
    id: 4,
    order: 5,
    projectId: 1,
    documentId: 1,
    text: 'This app shall be better than DOORS',
    type: 'DEF',
    classification: ['Security'],
    isHeading: false,
    chapter: 2,
    parentId: 3
  },
  {
    id: 5,
    order: 6,
    projectId: 1,
    documentId: 1,
    text: 'Why are DOORS bad',
    type: 'PROSE',
    classification: [],
    isHeading: true,
    chapter: 2,
    parentId: 3
  },
  {
    id: 6,
    order: 7,
    projectId: 1,
    documentId: 1,
    text: 'They are very bad',
    type: 'PROSE',
    classification: [],
    isHeading: false,
    chapter: 2,
    parentId: 5
  }
]
