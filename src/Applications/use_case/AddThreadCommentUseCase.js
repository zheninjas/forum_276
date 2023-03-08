import InsertThreadComment from '../../Domains/threads/entities/InsertThreadComment.js';

class AddThreadCommentUseCase {
  constructor({threadRepository, threadCommentRepository}) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCasePayload, useCaseParams, userId) {
    const {content} = useCasePayload;
    const {threadId} = useCaseParams;
    const insertThreadComment = new InsertThreadComment(threadId, content, userId);

    await this._threadRepository.verifyThread(threadId);

    return await this._threadCommentRepository.addComment(insertThreadComment);
  }
}

export default AddThreadCommentUseCase;
