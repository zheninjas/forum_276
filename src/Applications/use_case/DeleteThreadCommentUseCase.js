import RemoveThreadComment from '../../Domains/threads/entities/RemoveThreadComment.js';

class DeleteThreadCommentUseCase {
  constructor({threadCommentRepository}) {
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCaseParams, userId) {
    const {threadId, threadCommentId} = useCaseParams;
    const removeThreadComment = new RemoveThreadComment(threadId, threadCommentId, userId);

    await this._threadCommentRepository.verifyComment(threadCommentId, threadId);
    await this._threadCommentRepository.verifyCommentOwner(threadCommentId, userId);
    await this._threadCommentRepository.softDeleteComment(removeThreadComment);
  }
}

export default DeleteThreadCommentUseCase;
