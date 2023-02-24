class InsertThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.title = payload.title;
    this.body = payload.body;
  }

  _verifyPayload({title, body}) {
    if (!title || !body) {
      throw new Error('INSERT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('INSERT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default InsertThread;
