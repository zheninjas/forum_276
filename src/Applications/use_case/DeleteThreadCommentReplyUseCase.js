class DeleteThreadCommentReplyUseCase {
  constructor({threadCommentReplyRepository}) {
    this._threadCommentReplyRepository = threadCommentReplyRepository;
  }

  async execute(useCaseParams, userId) {
    this._validateParams(useCaseParams);
    this._validateUserId(userId);

    const {threadId, threadCommentId, threadCommentReplyId} = useCaseParams;

    await this._threadCommentReplyRepository.verifyThreadCommentReply(threadCommentReplyId, threadCommentId, threadId);
    await this._threadCommentReplyRepository.verifyReplyOwner(threadCommentReplyId, userId);
    await this._threadCommentReplyRepository.softDeleteReply(threadCommentReplyId, threadCommentId, userId);
  }

  _validateParams(useCaseParams) {
    const {threadId, threadCommentId, threadCommentReplyId} = useCaseParams;

    if (!threadId || !threadCommentId || !threadCommentReplyId) {
      throw new Error('DELETE_THREAD_COMMENT_REPLY_USE_CASE.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof threadId !== 'string' ||
      typeof threadCommentId !== 'string' ||
      typeof threadCommentReplyId !== 'string'
    ) {
      throw new Error('DELETE_THREAD_COMMENT_REPLY_USE_CASE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _validateUserId(userId) {
    if (!userId) {
      throw new Error('DELETE_THREAD_COMMENT_REPLY_USE_CASE.USER_ID_NOT_FOUND');
    }

    if (typeof userId !== 'string') {
      throw new Error('DELETE_THREAD_COMMENT_REPLY_USE_CASE.WRONG_USER_ID_DATA_TYPE');
    }
  }
}

export default DeleteThreadCommentReplyUseCase;
