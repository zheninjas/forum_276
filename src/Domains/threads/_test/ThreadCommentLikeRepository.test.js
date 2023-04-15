import ThreadCommentLikeRepository from '../ThreadCommentLikeRepository.js';

describe('ThreadCommentLikeRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const threadRepository = new ThreadCommentLikeRepository();

    // Action & Assert
    await expect(threadRepository.getLikeId('', '')).rejects.toThrowError(
      'THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(threadRepository.getLikesByCommentIds([])).rejects.toThrowError(
      'THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(threadRepository.insertLike({})).rejects.toThrowError(
      'THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(threadRepository.removeLike('')).rejects.toThrowError(
      'THREAD_COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});
