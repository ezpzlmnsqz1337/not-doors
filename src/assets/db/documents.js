import { v4 as uuidv4 } from 'uuid'
import { folders } from '@/assets/db/folders'

export const documents = [
  {
    uid: uuidv4(),
    name: 'P1 DOC1_R',
    folderId: folders.at(0).uid,
    columns: [1, 2, 3, 4]
  },
  {
    uid: uuidv4(),
    name: 'P1 DOC2_A',
    folderId: folders.at(1).uid,
    columns: [1, 2, 3, 4]
  },
  {
    uid: uuidv4(),
    name: 'P1 DOC3_IF',
    folderId: folders.at(2).uid,
    columns: [1, 2, 3, 4]
  },
  {
    uid: uuidv4(),
    name: 'P2 DOC1_R',
    folderId: folders.at(3).uid,
    columns: [1, 2, 3, 4]
  },
  {
    uid: uuidv4(),
    name: 'P2 DOC2_A',
    folderId: folders.at(4).uid,
    columns: [1, 2, 3, 4]
  },
  {
    uid: uuidv4(),
    name: 'P2 DOC3_IF',
    folderId: folders.at(5).uid,
    columns: [1, 2, 3, 4]
  }
]
