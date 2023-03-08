class RemoveThreadCommentReply {
  constructor(threadId, threadCommentId, threadCommentReplyId, userId) {
    this._validateData(threadId, threadCommentId, threadCommentReplyId, userId);

    this.threadId = threadId;
    this.threadCommentId = threadCommentId;
    this.threadCommentReplyId = threadCommentReplyId;
    this.userId = userId;
  }

  _validateData(threadId, threadCommentId, threadCommentReplyId, userId) {
    if (!threadId || !threadCommentId || !threadCommentReplyId) {
      throw new Error('REMOVE_THREAD_COMMENT_REPLY.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof threadId !== 'string' ||
      typeof threadCommentId !== 'string' ||
      typeof threadCommentReplyId !== 'string'
    ) {
      throw new Error('REMOVE_THREAD_COMMENT_REPLY.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (!userId) {
      throw new Error('REMOVE_THREAD_COMMENT_REPLY.USER_ID_NOT_FOUND');
    }

    if (typeof userId !== 'string') {
      throw new Error('REMOVE_THREAD_COMMENT_REPLY.WRONG_USER_ID_DATA_TYPE');
    }
  }
}

export default RemoveThreadCommentReply;
