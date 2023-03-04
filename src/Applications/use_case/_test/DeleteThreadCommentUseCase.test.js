import {jest} from '@jest/globals';
import ThreadCommentRepository from '../../../Domains/threads/ThreadCommentRepository.js';
import DeleteThreadCommentUseCase from '../DeleteThreadCommentUseCase.js';

describe('DeleteThreadCommentUseCase', () => {
  describe('_verifyParams function', () => {
    it('should throw error if params not contain needed property', async () => {
      // Arrange
      const useCaseParams = {
        threadId: 'thread-123',
      };

      const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({});

      // Action & Assert
      await expect(deleteThreadCommentUseCase.execute(useCaseParams, {})).rejects.toThrowError(
        'DELETE_THREAD_COMMENT_USE_CASE.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY',
      );
    });

    it('should throw error if params data type not string', async () => {
      // Arrange
      const useCaseParams = {
        threadId: 'thread-123',
        threadCommentId: 123,
      };

      const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({});

      // Action & Assert
      await expect(deleteThreadCommentUseCase.execute(useCaseParams, {})).rejects.toThrowError(
        'DELETE_THREAD_COMMENT_USE_CASE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    });
  });

  it('should orchestrating the delete thread comment action correctly', async () => {
    // Arrange
    const userAuthId = 'user-123';
    const threadId = 'thread-123';
    const threadCommentId = 'thread-comment-123';

    const useCaseParams = {
      threadId,
      threadCommentId,
    };

    const userAuthCredential = {
      id: userAuthId,
    };

    const mockThreadCommentRepository = new ThreadCommentRepository();

    mockThreadCommentRepository.verifyComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.softDeleteComment = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    await deleteThreadCommentUseCase.execute(useCaseParams, userAuthCredential);

    // Assert
    expect(mockThreadCommentRepository.verifyComment).toBeCalledWith(threadCommentId, threadId);
    expect(mockThreadCommentRepository.verifyCommentOwner).toBeCalledWith(threadCommentId, userAuthId);
    expect(mockThreadCommentRepository.softDeleteComment).toBeCalledWith(threadCommentId, threadId, userAuthId);
  });
});
