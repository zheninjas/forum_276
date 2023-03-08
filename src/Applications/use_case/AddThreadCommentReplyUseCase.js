import InsertThreadCommentReply from '../../Domains/threads/entities/InsertThreadCommentReply.js';

class AddThreadCommentReplyUseCase {
  constructor({threadRepository, threadCommentRepository, threadCommentReplyRepository}) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._threadCommentReplyRepository = threadCommentReplyRepository;
  }

  async execute(useCasePayload, useCaseParams, userId) {
    const {content} = useCasePayload;
    const {threadId, threadCommentId} = useCaseParams;
    const insertThreadCommentReply = new InsertThreadCommentReply(threadId, threadCommentId, content, userId);

    await this._threadRepository.verifyThread(threadId);
    await this._threadCommentRepository.verifyComment(threadCommentId, threadId);

    return await this._threadCommentReplyRepository.addReply(insertThreadCommentReply);
  }
}

export default AddThreadCommentReplyUseCase;
