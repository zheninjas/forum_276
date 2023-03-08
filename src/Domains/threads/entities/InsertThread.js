class InsertThread {
  constructor(title, body, userId) {
    this._validateData(title, body, userId);

    this.title = title;
    this.body = body;
    this.userId = userId;
  }

  _validateData(title, body, userId) {
    if (!title || !body) {
      throw new Error('INSERT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('INSERT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (!userId) {
      throw new Error('INSERT_THREAD.USER_ID_NOT_FOUND');
    }

    if (typeof userId !== 'string') {
      throw new Error('INSERT_THREAD.WRONG_USER_ID_DATA_TYPE');
    }
  }
}

export default InsertThread;
