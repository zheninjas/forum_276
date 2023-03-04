class NewThreadComment {
  constructor(payload) {
    this._validatePayload(payload);

    ({id: this.id, content: this.content, owner: this.owner} = payload);
  }

  _validatePayload({id, content, owner}) {
    if (!id || !content || !owner) {
      throw new Error('NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default NewThreadComment;
