import {jest} from '@jest/globals';
import RemoveThreadCommentReply from '../../../Domains/threads/entities/RemoveThreadCommentReply.js';
import ThreadCommentReplyRepository from '../../../Domains/threads/ThreadCommentReplyRepository.js';
import DeleteThreadCommentReplyUseCase from '../DeleteThreadCommentReplyUseCase.js';

describe('DeleteThreadCommentReplyUseCase', () => {
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

    mockThreadCommentReplyRepository.verifyThreadCommentReply = jest.fn(() => Promise.resolve());
    mockThreadCommentReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
    mockThreadCommentReplyRepository.softDeleteReply = jest.fn(() => Promise.resolve());

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
      new RemoveThreadCommentReply(threadId, threadCommentId, threadCommentReplyId, userAuthId),
    );
  });
});
