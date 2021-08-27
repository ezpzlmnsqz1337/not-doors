import { v4 as uuidv4 } from 'uuid'

export const users = [
  {
    uid: uuidv4(),
    name: 'Karl Adminmann',
    role: 'admin'
  },
  {
    uid: uuidv4(),
    name: 'Karl Developermann',
    role: 'developer'
  },
  {
    uid: uuidv4(),
    name: 'Karl Testermann',
    role: 'tester'
  },
  {
    uid: uuidv4(),
    name: 'Karl Validatormann',
    role: 'validator'
  },
  {
    uid: uuidv4(),
    name: 'Karl Qualitymann',
    role: 'quality'
  }
]
