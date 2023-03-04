class AddThreadCommentUseCase {
  constructor({threadRepository, threadCommentRepository}) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCasePayload, useCaseParams, userId) {
    this._validatePayload(useCasePayload);
    this._validateParams(useCaseParams);
    this._validateUserId(userId);

    const {content} = useCasePayload;
    const {threadId} = useCaseParams;

    await this._threadRepository.verifyThread(threadId);

    return await this._threadCommentRepository.addComment(content, threadId, userId);
  }

  _validatePayload(payload) {
    const {content} = payload;

    if (!content) {
      throw new Error('ADD_THREAD_COMMENT_USE_CASE.PAYLOAD_NOT_CONTAIN_CONTENT');
    }

    if (typeof content !== 'string') {
      throw new Error('ADD_THREAD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _validateParams(useCaseParams) {
    const {threadId} = useCaseParams;

    if (!threadId) {
      throw new Error('ADD_THREAD_COMMENT_USE_CASE.PARAMS_NOT_CONTAIN_THREAD_ID');
    }

    if (typeof threadId !== 'string') {
      throw new Error('ADD_THREAD_COMMENT_USE_CASE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _validateUserId(userId) {
    if (!userId) {
      throw new Error('ADD_THREAD_COMMENT_USE_CASE.USER_ID_NOT_FOUND');
    }

    if (typeof userId !== 'string') {
      throw new Error('ADD_THREAD_COMMENT_USE_CASE.WRONG_USER_ID_DATA_TYPE');
    }
  }
}

export default AddThreadCommentUseCase;
