import {jest} from '@jest/globals';
import NewThreadComment from '../../../Domains/threads/entities/NewThreadComment.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import ThreadCommentRepository from '../../../Domains/threads/ThreadCommentRepository.js';
import AddThreadCommentUseCase from '../AddThreadCommentUseCase.js';

describe('AddThreadUseCase', () => {
  describe('_verifyPayload function', () => {
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

  describe('_verifyParams function', () => {
    it('should throw error if params not contain threadId', async () => {
      // Arrange
      const useCasePayload = {
        content: 'comment content',
      };

      const params = {};

      const addThreadCommentUseCase = new AddThreadCommentUseCase({});

      // Action & Assert
      await expect(addThreadCommentUseCase.execute(useCasePayload, params, {})).rejects.toThrowError(
        'ADD_THREAD_COMMENT_USE_CASE.PARAMS_NOT_CONTAIN_THREAD_ID',
      );
    });

    it('should throw error if params threadId not string', async () => {
      // Arrange
      const useCasePayload = {
        content: 'comment content',
      };


      const params = {
        threadId: 123,
      };

      const addThreadCommentUseCase = new AddThreadCommentUseCase({});

      // Action & Assert
      await expect(addThreadCommentUseCase.execute(useCasePayload, params, {})).rejects.toThrowError(
        'ADD_THREAD_COMMENT_USE_CASE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    });
  });

  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const content = 'comment content';
    const userAuthId = 'user-123';
    const threadId = 'thread-123';

    const useCasePayload = {
      content,
    };

    const params = {
      threadId,
    };

    const userAuthCredential = {
      id: userAuthId,
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
    const addedThreadComment = await addThreadCommentUseCase.execute(useCasePayload, params, userAuthCredential);

    // Assert
    expect(addedThreadComment).toStrictEqual(expectedNewThreadComment);
    expect(mockThreadRepository.verifyThread).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.addComment).toBeCalledWith(content, threadId, userAuthId);
  });
});
