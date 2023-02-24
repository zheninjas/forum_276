class NewThread {
  constructor(payload) {
    this._verifyPayload(payload);

    ({id: this.id, title: this.title, owner: this.owner} = payload);
  }

  _verifyPayload({id, title, owner}) {
    if (!id || !title || !owner) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default NewThread;
