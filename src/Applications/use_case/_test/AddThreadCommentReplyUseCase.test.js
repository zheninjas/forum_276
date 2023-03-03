import {jest} from '@jest/globals';
import NewThreadCommentReply from '../../../Domains/threads/entities/NewThreadCommentReply.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import ThreadCommentRepository from '../../../Domains/threads/ThreadCommentRepository.js';
import ThreadCommentReplyRepository from '../../../Domains/threads/ThreadCommentReplyRepository.js';
import AddThreadCommentReplyUseCase from '../AddThreadCommentReplyUseCase.js';

describe('AddThreadCommentReplyUseCase', () => {
  describe('_verifyPayload function', () => {
    it('should throw error if use case payload not contain content', async () => {
      // Arrange
      const useCasePayload = {};
      const addThreadCommentReplyUseCase = new AddThreadCommentReplyUseCase({});

      // Action & Assert
      await expect(addThreadCommentReplyUseCase.execute(useCasePayload, {}, {})).rejects.toThrowError(
        'ADD_THREAD_COMMENT_REPLY_USE_CASE.PAYLOAD_NOT_CONTAIN_CONTENT',
      );
    });

    it('should throw error if content is not string', async () => {
      // Arrange
      const useCasePayload = {
        content: 1,
      };

      const addThreadCommentReplyUseCase = new AddThreadCommentReplyUseCase({});

      // Action & Assert
      await expect(addThreadCommentReplyUseCase.execute(useCasePayload, {}, {})).rejects.toThrowError(
        'ADD_THREAD_COMMENT_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    });
  });

  describe('_verifyParams function', () => {
    it('should throw error if params not contain needed property', async () => {
      // Arrange
      const useCasePayload = {
        content: 'comment content',
      };

      const useCaseParams = {
        threadId: 'thread-123',
      };

      const addThreadCommentReplyUseCase = new AddThreadCommentReplyUseCase({});

      // Action & Assert
      await expect(addThreadCommentReplyUseCase.execute(useCasePayload, useCaseParams, {})).rejects.toThrowError(
        'ADD_THREAD_COMMENT_REPLY_USE_CASE.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY',
      );
    });

    it('should throw error if params not meet data type specification', async () => {
      // Arrange
      const useCasePayload = {
        content: 'comment content',
      };

      const useCaseParams = {
        threadId: 'thread-123',
        threadCommentId: 123,
      };

      const addThreadCommentReplyUseCase = new AddThreadCommentReplyUseCase({});

      // Action & Assert
      await expect(addThreadCommentReplyUseCase.execute(useCasePayload, useCaseParams, {})).rejects.toThrowError(
        'ADD_THREAD_COMMENT_REPLY_USE_CASE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    });
  });

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

    const userAuthCredential = {
      id: userAuthId,
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

    mockThreadRepository.verifyThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.verifyComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadCommentReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockNewThreadCommentReply));

    const addThreadCommentReplyUseCase = new AddThreadCommentReplyUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentReplyRepository: mockThreadCommentReplyRepository,
    });

    // Action
    const addedThreadCommentReply = await addThreadCommentReplyUseCase.execute(
      useCasePayload,
      useCaseParams,
      userAuthCredential,
    );

    // Assert
    expect(addedThreadCommentReply).toStrictEqual(expectedNewThreadCommentReply);
    expect(mockThreadRepository.verifyThread).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.verifyComment).toBeCalledWith(threadCommentId, threadId);
    expect(mockThreadCommentReplyRepository.addReply).toBeCalledWith(
      threadCommentReplyContent,
      threadCommentId,
      userAuthId,
    );
  });
});
