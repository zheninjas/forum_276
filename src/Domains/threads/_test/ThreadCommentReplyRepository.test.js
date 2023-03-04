import ThreadCommentReplyRepository from '../ThreadCommentReplyRepository.js';

describe('ThreadCommentReplyRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const threadCommentReplyRepository = new ThreadCommentReplyRepository();

    // Action & Assert
    await expect(threadCommentReplyRepository.addReply('', '', '')).rejects.toThrowError(
      'THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(threadCommentReplyRepository.softDeleteReply('', '', '')).rejects.toThrowError(
      'THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(threadCommentReplyRepository.verifyReplyOwner('', '')).rejects.toThrowError(
      'THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );

    await expect(threadCommentReplyRepository.verifyThreadCommentReply('', '', '')).rejects.toThrowError(
      'THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});
