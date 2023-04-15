import {jest} from '@jest/globals';
import ToggleThreadCommentLike from '../../../Domains/threads/entities/ToggleThreadCommentLike.js';
import ThreadCommentLikeRepository from '../../../Domains/threads/ThreadCommentLikeRepository.js';
import ThreadCommentRepository from '../../../Domains/threads/ThreadCommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import ToggleThreadCommentLikeUseCase from '../ToggleThreadCommentLikeUseCase.js';

describe('ToggleThreadCommentLikeUseCase', () => {
  const userId = 'user-123';
  const threadId = 'thread-123';
  const threadCommentId = 'thread-comment-123';

  it('should orchestrating toggle add thread comment like action correctly', async () => {
    // Arrange
    const useCaseParams = {
      threadId,
      threadCommentId,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadCommentLikeRepository = new ThreadCommentLikeRepository();

    mockThreadRepository.verifyThread = jest.fn(() => Promise.resolve());
    mockThreadCommentRepository.verifyComment = jest.fn(() => Promise.resolve());
    mockThreadCommentLikeRepository.getLikeId = jest.fn(() => Promise.resolve(null));
    mockThreadCommentLikeRepository.insertLike = jest.fn(() => Promise.resolve());

    const toggleThreadCommentLikeUseCase = new ToggleThreadCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentLikeRepository: mockThreadCommentLikeRepository,
    });

    // Action
    await toggleThreadCommentLikeUseCase.execute(useCaseParams, userId);

    // Assert
    expect(mockThreadRepository.verifyThread).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.verifyComment).toBeCalledWith(threadCommentId, threadId);
    expect(mockThreadCommentLikeRepository.getLikeId).toBeCalledWith(threadCommentId, userId);
    expect(mockThreadCommentLikeRepository.insertLike).toBeCalledWith(
      new ToggleThreadCommentLike(threadId, threadCommentId, userId),
    );
  });

  it('should orchestrating toggle remove existing thread comment like action correctly', async () => {
    // Arrange
    const threadCommentLikeId = 'thread-comment-like-123';

    const useCaseParams = {
      threadId,
      threadCommentId,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadCommentLikeRepository = new ThreadCommentLikeRepository();

    mockThreadRepository.verifyThread = jest.fn(() => Promise.resolve());
    mockThreadCommentRepository.verifyComment = jest.fn(() => Promise.resolve());
    mockThreadCommentLikeRepository.getLikeId = jest.fn(() => Promise.resolve(threadCommentLikeId));
    mockThreadCommentLikeRepository.removeLike = jest.fn(() => Promise.resolve());

    const toggleThreadCommentLikeUseCase = new ToggleThreadCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentLikeRepository: mockThreadCommentLikeRepository,
    });

    // Action
    await toggleThreadCommentLikeUseCase.execute(useCaseParams, userId);

    // Assert
    expect(mockThreadRepository.verifyThread).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.verifyComment).toBeCalledWith(threadCommentId, threadId);
    expect(mockThreadCommentLikeRepository.getLikeId).toBeCalledWith(threadCommentId, userId);
    expect(mockThreadCommentLikeRepository.removeLike).toBeCalledWith(threadCommentLikeId);
  });
});
