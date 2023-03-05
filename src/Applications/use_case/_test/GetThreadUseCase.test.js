import {jest} from '@jest/globals';
import ThreadDetail from '../../../Domains/threads/entities/ThreadDetail.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import GetThreadUseCase from '../GetThreadUseCase.js';

describe('GetThreadUseCase', () => {
  describe('_validateParams function', () => {
    it('should throw error if params not contain needed property', async () => {
      // Arrange
      const useCaseParams = {};
      const getThreadUseCase = new GetThreadUseCase({});

      // Action & Assert
      await expect(getThreadUseCase.execute(useCaseParams, {})).rejects.toThrowError(
        'GET_THREAD_USE_CASE.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY',
      );
    });

    it('should throw error if params data type not string', async () => {
      // Arrange
      const useCaseParams = {
        threadId: 123,
      };

      const getThreadUseCase = new GetThreadUseCase({});

      // Action & Assert
      await expect(getThreadUseCase.execute(useCaseParams, {})).rejects.toThrowError(
        'GET_THREAD_USE_CASE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    });
  });

  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const useCaseParams = {
      threadId,
    };

    // Arrange
    const thread = {
      thread_id: threadId,
      thread_title: 'Thread Title',
      thread_body: 'Thread Body',
      thread_date: '2023-02-25T07:00:00.800Z',
      thread_owner_username: 'user-123',
    };

    const comment = {
      comment_id: 'thread-comment-123',
      comment_owner_username: 'user-123',
      comment_date: '2023-02-25T08:00:00.800Z',
      comment_content: 'comment content one',
      comment_deleted: true,
    };

    const commentReply = {
      reply_id: 'thread-comment-reply-123',
      reply_owner_username: 'user-234',
      reply_date: '2023-02-25T08:10:00.800Z',
      reply_content: 'reply one comment two',
      reply_deleted: true,
    };

    const threadPayload = [
      {
        ...thread,
        ...comment,
        ...commentReply,
      },
    ];

    const mockThreadDetail = new ThreadDetail(threadPayload);
    const expectedThreadDetail = new ThreadDetail(threadPayload);

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThread = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadWithComments = jest.fn().mockImplementation(() => Promise.resolve(mockThreadDetail));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const threadDetail = await getThreadUseCase.execute(useCaseParams);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetail);
    expect(mockThreadRepository.verifyThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadWithComments).toBeCalledWith(threadId);
  });
});
