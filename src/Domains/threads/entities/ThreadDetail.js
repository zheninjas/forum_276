class ThreadDetail {
  constructor(payload) {
    this._validatePayload(payload);

    ({
      id: this.id,
      title: this.title,
      body: this.body,
      date: this.date,
      username: this.username,
      comments: this.comments,
    } = payload);
  }

  _validatePayload(payload) {
    const {id, title, body, date, username, comments} = payload;

    if (!id || !title || !body || !date || !username || !comments) {
      throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof date !== 'string' ||
      typeof username !== 'string' ||
      !(comments instanceof Array)
    ) {
      throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default ThreadDetail;
