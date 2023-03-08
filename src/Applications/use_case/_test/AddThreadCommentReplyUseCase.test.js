import {jest} from '@jest/globals';
import InsertThreadCommentReply from '../../../Domains/threads/entities/InsertThreadCommentReply.js';
import NewThreadCommentReply from '../../../Domains/threads/entities/NewThreadCommentReply.js';
import ThreadCommentReplyRepository from '../../../Domains/threads/ThreadCommentReplyRepository.js';
import ThreadCommentRepository from '../../../Domains/threads/ThreadCommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddThreadCommentReplyUseCase from '../AddThreadCommentReplyUseCase.js';

describe('AddThreadCommentReplyUseCase', () => {
  it('should orchestrating the add thread comment reply action correctly', async () => {
    // Arrange
    const userAuthId = 'user-123';
    const threadId = 'thread-123';
    const threadCommentId = 'thread-comment-123';
    const threadCommentReplyId = 'thread-comment-reply-123';
    const threadCommentReplyContent = 'reply comment content';

    const useCasePayload = {
      content: threadCommentReplyContent,
    };

    const useCaseParams = {
      threadId,
      threadCommentId,
    };

    const mockNewThreadCommentReply = new NewThreadCommentReply({
      id: threadCommentReplyId,
      content: threadCommentReplyContent,
      owner: userAuthId,
    });

    const expectedNewThreadCommentReply = new NewThreadCommentReply({
      id: threadCommentReplyId,
      content: threadCommentReplyContent,
      owner: userAuthId,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadCommentReplyRepository = new ThreadCommentReplyRepository();

    mockThreadRepository.verifyThread = jest.fn(() => Promise.resolve());
    mockThreadCommentRepository.verifyComment = jest.fn(() => Promise.resolve());
    mockThreadCommentReplyRepository.addReply = jest.fn(() => Promise.resolve(mockNewThreadCommentReply));

    const addThreadCommentReplyUseCase = new AddThreadCommentReplyUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentReplyRepository: mockThreadCommentReplyRepository,
    });

    // Action
    const addedThreadCommentReply = await addThreadCommentReplyUseCase.execute(
      useCasePayload,
      useCaseParams,
      userAuthId,
    );

    // Assert
    expect(addedThreadCommentReply).toStrictEqual(expectedNewThreadCommentReply);
    expect(mockThreadRepository.verifyThread).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.verifyComment).toBeCalledWith(threadCommentId, threadId);
    expect(mockThreadCommentReplyRepository.addReply).toBeCalledWith(
      new InsertThreadCommentReply(threadId, threadCommentId, threadCommentReplyContent, userAuthId),
    );
  });
});
