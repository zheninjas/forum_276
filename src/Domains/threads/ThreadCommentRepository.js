class ThreadCommentRepository {
  async addComment(insertThreadComment) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getComments(threadId) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async softDeleteComment(removeThreadComment) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentOwner(threadCommentId, userId) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyComment(threadCommentId, threadId) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default ThreadCommentRepository;
