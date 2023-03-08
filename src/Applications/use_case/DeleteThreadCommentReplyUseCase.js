import RemoveThreadCommentReply from '../../Domains/threads/entities/RemoveThreadCommentReply.js';

class DeleteThreadCommentReplyUseCase {
  constructor({threadCommentReplyRepository}) {
    this._threadCommentReplyRepository = threadCommentReplyRepository;
  }

  async execute(useCaseParams, userId) {
    const {threadId, threadCommentId, threadCommentReplyId} = useCaseParams;
    const removeThreadCommentReply = new RemoveThreadCommentReply(
      threadId,
      threadCommentId,
      threadCommentReplyId,
      userId,
    );

    await this._threadCommentReplyRepository.verifyThreadCommentReply(threadCommentReplyId, threadCommentId, threadId);
    await this._threadCommentReplyRepository.verifyReplyOwner(threadCommentReplyId, userId);
    await this._threadCommentReplyRepository.softDeleteReply(removeThreadCommentReply);
  }
}

export default DeleteThreadCommentReplyUseCase;
