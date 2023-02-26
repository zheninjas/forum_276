import ThreadCommentRepository from '../ThreadCommentRepository.js';

describe('ThreadCommentRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepository();

    // Action & Assert
    await expect(threadCommentRepository.addComment('', '', '')).rejects.toThrowError(
      'THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(threadCommentRepository.softDeleteComment('', '', '')).rejects.toThrowError(
      'THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(threadCommentRepository.verifyCommentOwner('', '')).rejects.toThrowError(
      'THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(threadCommentRepository.verifyComment('', '')).rejects.toThrowError(
      'THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});
