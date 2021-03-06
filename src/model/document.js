import { v4 as uuidv4 } from 'uuid'

export default () => ({
  /**
   * @type {String}
   * unique identifier of the document generated by the uuid module
   */
  uid: uuidv4(),
  /**
   * @type {String}
   * name of this document
   */
  name: 'Document',
  /**
   * @type {String}
   * unique identifier of the the parent folder that this document belongs to
   */
  parentId: null,
  /**
   * @type {Array}
   * list of columns that this document contains
   */
  columns: []
})
