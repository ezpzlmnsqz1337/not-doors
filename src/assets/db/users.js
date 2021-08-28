import { v4 as uuidv4 } from 'uuid'

export const users = [
  {
    uid: uuidv4(),
    name: 'Karl Adminman',
    email: 'karl.adminman@not-doors.com',
    password: 'yourmom',
    role: 'admin'
  },
  {
    uid: uuidv4(),
    name: 'Karl Developerman',
    email: 'karl.developerman@not-doors.com',
    password: 'yourmom',
    role: 'developer'
  },
  {
    uid: uuidv4(),
    name: 'Karl Testerman',
    email: 'karl.testerman@not-doors.com',
    password: 'yourmom',
    role: 'tester'
  },
  {
    uid: uuidv4(),
    name: 'Karl Validatorman',
    email: 'karl.validatorman@not-doors.com',
    password: 'yourmom',
    role: 'validator'
  },
  {
    uid: uuidv4(),
    name: 'Karl Qualityman',
    email: 'karl.qualityman@not-doors.com',
    password: 'yourmom',
    role: 'quality'
  }
]
