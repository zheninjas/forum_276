import {jest} from '@jest/globals';
import NewThreadComment from '../../../Domains/threads/entities/NewThreadComment.js';
import ThreadCommentRepository from '../../../Domains/threads/ThreadCommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddThreadCommentUseCase from '../AddThreadCommentUseCase.js';

describe('AddThreadCommentUseCase', () => {
  describe('_validatePayload function', () => {
    it('should throw error if use case payload not contain content', async () => {
      // Arrange
      const useCasePayload = {};
      const addThreadCommentUseCase = new AddThreadCommentUseCase({});

      // Action & Assert
      await expect(addThreadCommentUseCase.execute(useCasePayload, {}, {})).rejects.toThrowError(
        'ADD_THREAD_COMMENT_USE_CASE.PAYLOAD_NOT_CONTAIN_CONTENT',
      );
    });

    it('should throw error if content is not string', async () => {
      // Arrange
      const useCasePayload = {
        content: 1,
      };

      const addThreadCommentUseCase = new AddThreadCommentUseCase({});

      // Action & Assert
      await expect(addThreadCommentUseCase.execute(useCasePayload, {}, {})).rejects.toThrowError(
        'ADD_THREAD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    });
  });

  describe('_validateParams function', () => {
    it('should throw error if params not contain threadId', async () => {
      // Arrange
      const useCasePayload = {
        content: 'comment content',
      };

      const useCaseParams = {};
      const addThreadCommentUseCase = new AddThreadCommentUseCase({});

      // Action & Assert
      await expect(addThreadCommentUseCase.execute(useCasePayload, useCaseParams, {})).rejects.toThrowError(
        'ADD_THREAD_COMMENT_USE_CASE.PARAMS_NOT_CONTAIN_THREAD_ID',
      );
    });

    it('should throw error if params threadId not string', async () => {
      // Arrange
      const useCasePayload = {
        content: 'comment content',
      };

      const useCaseParams = {
        threadId: 123,
      };

      const addThreadCommentUseCase = new AddThreadCommentUseCase({});

      // Action & Assert
      await expect(addThreadCommentUseCase.execute(useCasePayload, useCaseParams, {})).rejects.toThrowError(
        'ADD_THREAD_COMMENT_USE_CASE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    });
  });

  describe('_validateUserId function', () => {
    it('should throw error if userId undefined', async () => {
      // Arrange
      const useCasePayload = {
        content: 'comment content',
      };

      const useCaseParams = {
        threadId: 'thread-123',
      };

      const addThreadCommentUseCase = new AddThreadCommentUseCase({});

      // Action & Assert
      await expect(addThreadCommentUseCase.execute(useCasePayload, useCaseParams)).rejects.toThrowError(
        'ADD_THREAD_COMMENT_USE_CASE.USER_ID_NOT_FOUND',
      );
    });

    it('should throw error if userId not string', async () => {
      // Arrange
      const useCasePayload = {
        content: 'comment content',
      };

      const useCaseParams = {
        threadId: 'thread-123',
      };

      const userId = 123;
      const addThreadCommentUseCase = new AddThreadCommentUseCase({});

      // Action & Assert
      await expect(addThreadCommentUseCase.execute(useCasePayload, useCaseParams, userId)).rejects.toThrowError(
        'ADD_THREAD_COMMENT_USE_CASE.WRONG_USER_ID_DATA_TYPE',
      );
    });
  });

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

    mockThreadRepository.verifyThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(mockNewThreadComment));

    const addThreadCommentUseCase = new AddThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    const addedThreadComment = await addThreadCommentUseCase.execute(useCasePayload, useCaseParams, userAuthId);

    // Assert
    expect(addedThreadComment).toStrictEqual(expectedNewThreadComment);
    expect(mockThreadRepository.verifyThread).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.addComment).toBeCalledWith(content, threadId, userAuthId);
  });
});
