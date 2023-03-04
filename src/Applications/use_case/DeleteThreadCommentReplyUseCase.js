import UserCredential from '../../Domains/users/entities/UserCredential.js';

class DeleteThreadCommentReplyUseCase {
  constructor({threadCommentReplyRepository}) {
    this._threadCommentReplyRepository = threadCommentReplyRepository;
  }

  async execute(useCaseParams, userAuthCredential) {
    this._validateParams(useCaseParams);

    const {threadId, threadCommentId, threadCommentReplyId} = useCaseParams;
    const {userId} = new UserCredential(userAuthCredential);

    await this._threadCommentReplyRepository.verifyThreadCommentReply(threadCommentReplyId, threadCommentId, threadId);
    await this._threadCommentReplyRepository.verifyReplyOwner(threadCommentReplyId, userId);
    await this._threadCommentReplyRepository.softDeleteReply(
      threadCommentReplyId,
      threadCommentId,
      userId,
    );
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
}

export default DeleteThreadCommentReplyUseCase;
