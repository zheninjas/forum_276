import UserCredential from '../../Domains/users/entities/UserCredential.js';

class DeleteThreadCommentUseCase {
  constructor({threadCommentRepository}) {
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCaseParams, userAuthCredential) {
    this._validateParams(useCaseParams);

    const {threadId, threadCommentId} = useCaseParams;
    const {userId} = new UserCredential(userAuthCredential);

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
}

export default DeleteThreadCommentUseCase;
