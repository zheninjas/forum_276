class RemoveThreadComment {
  constructor(threadId, threadCommentId, userId) {
    this._validateData(threadId, threadCommentId, userId);

    this.threadId = threadId;
    this.threadCommentId = threadCommentId;
    this.userId = userId;
  }

  _validateData(threadId, threadCommentId, userId) {
    if (!threadId || !threadCommentId) {
      throw new Error('REMOVE_THREAD_COMMENT.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof threadCommentId !== 'string') {
      throw new Error('REMOVE_THREAD_COMMENT.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (!userId) {
      throw new Error('REMOVE_THREAD_COMMENT.USER_ID_NOT_FOUND');
    }

    if (typeof userId !== 'string') {
      throw new Error('REMOVE_THREAD_COMMENT.WRONG_USER_ID_DATA_TYPE');
    }
  }
}

export default RemoveThreadComment;
