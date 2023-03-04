import {jest} from '@jest/globals';
import ThreadCommentReplyRepository from '../../../Domains/threads/ThreadCommentReplyRepository.js';
import DeleteThreadCommentReplyUseCase from '../DeleteThreadCommentReplyUseCase.js';

describe('DeleteThreadCommentReplyUseCase', () => {
  describe('_validateParams function', () => {
    it('should throw error if params not contain needed property', async () => {
      // Arrange
      const useCaseParams = {
        threadId: 'thread-123',
        threadCommentId: 'thread-comment-123',
      };

      const deleteThreadCommentReplyUseCase = new DeleteThreadCommentReplyUseCase({});

      // Action & Assert
      await expect(deleteThreadCommentReplyUseCase.execute(useCaseParams, {})).rejects.toThrowError(
        'DELETE_THREAD_COMMENT_REPLY_USE_CASE.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY',
      );
    });

    it('should throw error if params data type not string', async () => {
      // Arrange
      const useCaseParams = {
        threadId: 'thread-123',
        threadCommentId: 'thread-comment-123',
        threadCommentReplyId: 123,
      };

      const deleteThreadCommentReplyUseCase = new DeleteThreadCommentReplyUseCase({});

      // Action & Assert
      await expect(deleteThreadCommentReplyUseCase.execute(useCaseParams, {})).rejects.toThrowError(
        'DELETE_THREAD_COMMENT_REPLY_USE_CASE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    });
  });

  describe('_validateUserId function', () => {
    it('should throw error if userId undefined', async () => {
      // Arrange
      const useCaseParams = {
        threadId: 'thread-123',
        threadCommentId: 'thread-comment-123',
        threadCommentReplyId: 'thread-comment-reply-123',
      };

      const deleteThreadCommentReplyUseCase = new DeleteThreadCommentReplyUseCase({});

      // Action & Assert
      await expect(deleteThreadCommentReplyUseCase.execute(useCaseParams)).rejects.toThrowError(
        'DELETE_THREAD_COMMENT_REPLY_USE_CASE.USER_ID_NOT_FOUND',
      );
    });

    it('should throw error if userId not string', async () => {
      // Arrange
      const useCaseParams = {
        threadId: 'thread-123',
        threadCommentId: 'thread-comment-123',
        threadCommentReplyId: 'thread-comment-reply-123',
      };

      const userId = 123;
      const deleteThreadCommentReplyUseCase = new DeleteThreadCommentReplyUseCase({});

      // Action & Assert
      await expect(deleteThreadCommentReplyUseCase.execute(useCaseParams, userId)).rejects.toThrowError(
        'DELETE_THREAD_COMMENT_REPLY_USE_CASE.WRONG_USER_ID_DATA_TYPE',
      );
    });
  });

  it('should orchestrating the delete thread comment reply action correctly', async () => {
    // Arrange
    const userAuthId = 'user-123';
    const threadId = 'thread-123';
    const threadCommentId = 'thread-comment-123';
    const threadCommentReplyId = 'thread-comment-reply-123';

    const useCaseParams = {
      threadId,
      threadCommentId,
      threadCommentReplyId,
    };

    const mockThreadCommentReplyRepository = new ThreadCommentReplyRepository();

    mockThreadCommentReplyRepository.verifyThreadCommentReply = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentReplyRepository.verifyReplyOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentReplyRepository.softDeleteReply = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteThreadCommentReplyUseCase = new DeleteThreadCommentReplyUseCase({
      threadCommentReplyRepository: mockThreadCommentReplyRepository,
    });

    // Action
    await deleteThreadCommentReplyUseCase.execute(useCaseParams, userAuthId);

    // Assert
    expect(mockThreadCommentReplyRepository.verifyThreadCommentReply).toBeCalledWith(
      threadCommentReplyId,
      threadCommentId,
      threadId,
    );

    expect(mockThreadCommentReplyRepository.verifyReplyOwner).toBeCalledWith(threadCommentReplyId, userAuthId);
    expect(mockThreadCommentReplyRepository.softDeleteReply).toBeCalledWith(
      threadCommentReplyId,
      threadCommentId,
      userAuthId,
    );
  });
});
