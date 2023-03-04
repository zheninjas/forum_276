class AddThreadCommentReplyUseCase {
  constructor({threadRepository, threadCommentRepository, threadCommentReplyRepository}) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._threadCommentReplyRepository = threadCommentReplyRepository;
  }

  async execute(useCasePayload, useCaseParams, userId) {
    this._validatePayload(useCasePayload);
    this._validateParams(useCaseParams);
    this._validateUserId(userId);

    const {content} = useCasePayload;
    const {threadId, threadCommentId} = useCaseParams;

    await this._threadRepository.verifyThread(threadId);
    await this._threadCommentRepository.verifyComment(threadCommentId, threadId);

    return await this._threadCommentReplyRepository.addReply(content, threadCommentId, userId);
  }

  _validatePayload(payload) {
    const {content} = payload;

    if (!content) {
      throw new Error('ADD_THREAD_COMMENT_REPLY_USE_CASE.PAYLOAD_NOT_CONTAIN_CONTENT');
    }

    if (typeof content !== 'string') {
      throw new Error('ADD_THREAD_COMMENT_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _validateParams(useCaseParams) {
    const {threadId, threadCommentId} = useCaseParams;

    if (!threadId || !threadCommentId) {
      throw new Error('ADD_THREAD_COMMENT_REPLY_USE_CASE.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof threadCommentId !== 'string') {
      throw new Error('ADD_THREAD_COMMENT_REPLY_USE_CASE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _validateUserId(userId) {
    if (!userId) {
      throw new Error('ADD_THREAD_COMMENT_REPLY_USE_CASE.USER_ID_NOT_FOUND');
    }

    if (typeof userId !== 'string') {
      throw new Error('ADD_THREAD_COMMENT_REPLY_USE_CASE.WRONG_USER_ID_DATA_TYPE');
    }
  }
}

export default AddThreadCommentReplyUseCase;
