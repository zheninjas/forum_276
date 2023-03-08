import {jest} from '@jest/globals';
import RemoveThreadComment from '../../../Domains/threads/entities/RemoveThreadComment.js';
import ThreadCommentRepository from '../../../Domains/threads/ThreadCommentRepository.js';
import DeleteThreadCommentUseCase from '../DeleteThreadCommentUseCase.js';

describe('DeleteThreadCommentUseCase', () => {
  it('should orchestrating the delete thread comment action correctly', async () => {
    // Arrange
    const userAuthId = 'user-123';
    const threadId = 'thread-123';
    const threadCommentId = 'thread-comment-123';

    const useCaseParams = {
      threadId,
      threadCommentId,
    };

    const mockThreadCommentRepository = new ThreadCommentRepository();

    mockThreadCommentRepository.verifyComment = jest.fn(() => Promise.resolve());
    mockThreadCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
    mockThreadCommentRepository.softDeleteComment = jest.fn(() => Promise.resolve());

    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    await deleteThreadCommentUseCase.execute(useCaseParams, userAuthId);

    // Assert
    expect(mockThreadCommentRepository.verifyComment).toBeCalledWith(threadCommentId, threadId);
    expect(mockThreadCommentRepository.verifyCommentOwner).toBeCalledWith(threadCommentId, userAuthId);
    expect(mockThreadCommentRepository.softDeleteComment).toBeCalledWith(
      new RemoveThreadComment(threadId, threadCommentId, userAuthId),
    );
  });
});
