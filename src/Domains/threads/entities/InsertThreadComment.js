class InsertThreadComment {
  constructor(threadId, content, userId) {
    this._validateData(threadId, content, userId);

    this.threadId = threadId;
    this.content = content;
    this.userId = userId;
  }

  _validateData(threadId, content, userId) {
    if (!threadId) {
      throw new Error('INSERT_THREAD_COMMENT.PARAMS_NOT_CONTAIN_THREAD_ID');
    }

    if (typeof threadId !== 'string') {
      throw new Error('INSERT_THREAD_COMMENT.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (!content) {
      throw new Error('INSERT_THREAD_COMMENT.PAYLOAD_NOT_CONTAIN_CONTENT');
    }

    if (typeof content !== 'string') {
      throw new Error('INSERT_THREAD_COMMENT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (!userId) {
      throw new Error('INSERT_THREAD_COMMENT.USER_ID_NOT_FOUND');
    }

    if (typeof userId !== 'string') {
      throw new Error('INSERT_THREAD_COMMENT.WRONG_USER_ID_DATA_TYPE');
    }
  }
}

export default InsertThreadComment;
