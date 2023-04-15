class ThreadCommentLikeRepository {
  async getLikeId(threadCommentId, userId) {
    throw new Error('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getLikesByCommentIds(threadCommentIds) {
    throw new Error('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async insertLike(toggleThreadCommentLike) {
    throw new Error('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async removeLike(threadCommentLikeId) {
    throw new Error('THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default ThreadCommentLikeRepository;
