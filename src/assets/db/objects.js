import { v4 as uuidv4 } from 'uuid'
import { documents } from '@/assets/db/documents'

const [ch1Id, ch2Id, ch3Id] = [uuidv4(), uuidv4(), uuidv4()]

export const objects = [
  {
    uid: ch1Id,
    id: 1,
    order: 1,
    documentId: documents.at(0).uid,
    type: 'PROSE',
    text: 'My first chapter',
    classification: [],
    isHeading: true,
    parentId: 0
  },
  {
    uid: uuidv4(),
    id: 2,
    order: 1,
    documentId: documents.at(0).uid,
    type: 'PROSE',
    text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Quisque tincidunt scelerisque libero. In dapibus augue non sapien. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed vel lectus.',
    classification: [],
    isHeading: false,
    parentId: ch1Id
  },
  {
    uid: uuidv4(),
    id: 3,
    order: 2,
    documentId: documents.at(0).uid,
    type: 'PROSE',
    text: 'Maecenas sollicitudin. Mauris suscipit, ligula sit amet pharetra semper, nibh ante cursus purus, vel sagittis velit mauris vel metus.',
    classification: [],
    isHeading: false,
    parentId: ch1Id
  },
  {
    uid: ch2Id,
    id: 4,
    order: 2,
    documentId: documents.at(0).uid,
    type: 'PROSE',
    text: 'My second chapter',
    classification: [],
    isHeading: true,
    parentId: 0
  },
  {
    uid: uuidv4(),
    id: 5,
    order: 1,
    documentId: documents.at(0).uid,
    text: 'This app shall be better than DOORS',
    type: 'DEF',
    classification: ['Security'],
    isHeading: false,
    parentId: ch2Id
  },
  {
    uid: ch3Id,
    id: 6,
    order: 2,
    documentId: documents.at(0).uid,
    text: 'Why are DOORS bad',
    type: 'PROSE',
    classification: [],
    isHeading: true,
    parentId: ch2Id
  },
  {
    uid: uuidv4(),
    id: 7,
    order: 1,
    documentId: documents.at(0).uid,
    text: 'They are very bad',
    type: 'PROSE',
    classification: [],
    isHeading: false,
    parentId: ch3Id
  }
]
