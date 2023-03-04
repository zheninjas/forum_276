import UserCredential from '../../Domains/users/entities/UserCredential.js';

class AddThreadCommentUseCase {
  constructor({threadRepository, threadCommentRepository}) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCasePayload, useCaseParams, useAuthCredential) {
    this._validatePayload(useCasePayload);
    this._validateParams(useCaseParams);

    const {content} = useCasePayload;
    const {threadId} = useCaseParams;
    const {userId} = new UserCredential(useAuthCredential);

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
}

export default AddThreadCommentUseCase;
