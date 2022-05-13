const API = {
  SUCCESS: 'Success',
  UPDATE_FAILED: {
    MESSAGE: {
      TEXT: 'Update failed internal error',
      CODE: 10399
    }
  },
  CREATE_FAILED: {
    MESSAGE: {
      TEXT: 'Create failed internal error',
      CODE: 10400
    }
  },
  DELETE_FAILED: {
    MESSAGE: {
      TEXT: 'Delete failed internal error',
      CODE: 10401
    }
  },
  NOT_FOUND: {
    USER_ID: {
      NOT_FOUND_USER_ID: 'Not found userId',
      CODE: 10404
    }
  }
}

module.exports = {
  API
}
