class DeleteThreadCommentUseCase {
  constructor({threadCommentRepository}) {
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCaseParams, userId) {
    this._validateParams(useCaseParams);
    this._validateUserId(userId);

    const {threadId, threadCommentId} = useCaseParams;

    await this._threadCommentRepository.verifyComment(threadCommentId, threadId);
    await this._threadCommentRepository.verifyCommentOwner(threadCommentId, userId);
    await this._threadCommentRepository.softDeleteComment(threadCommentId, threadId, userId);
  }

  _validateParams(useCaseParams) {
    const {threadId, threadCommentId} = useCaseParams;

    if (!threadId || !threadCommentId) {
      throw new Error('DELETE_THREAD_COMMENT_USE_CASE.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof threadCommentId !== 'string') {
      throw new Error('DELETE_THREAD_COMMENT_USE_CASE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _validateUserId(userId) {
    if (!userId) {
      throw new Error('DELETE_THREAD_COMMENT_USE_CASE.USER_ID_NOT_FOUND');
    }

    if (typeof userId !== 'string') {
      throw new Error('DELETE_THREAD_COMMENT_USE_CASE.WRONG_USER_ID_DATA_TYPE');
    }
  }
}

export default DeleteThreadCommentUseCase;
