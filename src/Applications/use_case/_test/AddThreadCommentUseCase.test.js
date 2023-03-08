import {jest} from '@jest/globals';
import InsertThreadComment from '../../../Domains/threads/entities/InsertThreadComment.js';
import NewThreadComment from '../../../Domains/threads/entities/NewThreadComment.js';
import ThreadCommentRepository from '../../../Domains/threads/ThreadCommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddThreadCommentUseCase from '../AddThreadCommentUseCase.js';

describe('AddThreadCommentUseCase', () => {
  it('should orchestrating the add thread comment action correctly', async () => {
    // Arrange
    const userAuthId = 'user-123';
    const threadId = 'thread-123';
    const content = 'comment content';

    const useCasePayload = {
      content,
    };

    const useCaseParams = {
      threadId,
    };

    const mockNewThreadComment = new NewThreadComment({
      id: threadId,
      content,
      owner: userAuthId,
    });

    const expectedNewThreadComment = new NewThreadComment({
      id: threadId,
      content,
      owner: userAuthId,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    mockThreadRepository.verifyThread = jest.fn(() => Promise.resolve());
    mockThreadCommentRepository.addComment = jest.fn(() => Promise.resolve(mockNewThreadComment));

    const addThreadCommentUseCase = new AddThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    const addedThreadComment = await addThreadCommentUseCase.execute(useCasePayload, useCaseParams, userAuthId);

    // Assert
    expect(addedThreadComment).toStrictEqual(expectedNewThreadComment);
    expect(mockThreadRepository.verifyThread).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.addComment).toBeCalledWith(
      new InsertThreadComment(threadId, content, userAuthId),
    );
  });
});
