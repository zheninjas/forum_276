class InsertThreadCommentReply {
  constructor(threadId, threadCommentId, content, userId) {
    this._validateData(threadId, threadCommentId, content, userId);

    this.threadId = threadId;
    this.threadCommentId = threadCommentId;
    this.content = content;
    this.userId = userId;
  }

  _validateData(threadId, threadCommentId, content, userId) {
    if (!threadId || !threadCommentId) {
      throw new Error('INSERT_THREAD_COMMENT_REPLY.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof threadCommentId !== 'string') {
      throw new Error('INSERT_THREAD_COMMENT_REPLY.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (!content) {
      throw new Error('INSERT_THREAD_COMMENT_REPLY.PAYLOAD_NOT_CONTAIN_CONTENT');
    }

    if (typeof content !== 'string') {
      throw new Error('INSERT_THREAD_COMMENT_REPLY.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (!userId) {
      throw new Error('INSERT_THREAD_COMMENT_REPLY.USER_ID_NOT_FOUND');
    }

    if (typeof userId !== 'string') {
      throw new Error('INSERT_THREAD_COMMENT_REPLY.WRONG_USER_ID_DATA_TYPE');
    }
  }
}

export default InsertThreadCommentReply;
