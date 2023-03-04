class ThreadCommentReplyRepository {
  async addReply(content, threadCommentId, userId) {
    throw new Error('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async softDeleteReply(threadCommentReplyId, threadCommentId, userId) {
    throw new Error('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyOwner(threadCommentReplyId, userId) {
    throw new Error('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyThreadCommentReply(threadCommentReplyId, threadCommentId, threadId) {
    throw new Error('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default ThreadCommentReplyRepository;
