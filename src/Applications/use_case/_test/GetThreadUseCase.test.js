import {jest} from '@jest/globals';
import ThreadCommentDetail from '../../../Domains/threads/entities/ThreadCommentDetail.js';
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
    const username = 'monne';
    const threadId = 'thread-123';
    const title = 'Thread Title';
    const body = 'Thread Body';
    const threadDate = '2023-02-26T07:00:00.800Z';

    const useCaseParams = {
      threadId,
    };

    const threadCommentDetail = new ThreadCommentDetail({
      id: 'thread-comment-123',
      username,
      date: '2023-02-26T08:00:00.800Z',
      content: 'comment content',
      is_delete: false,
      replies: [],
    });

    const mockThreadDetail = new ThreadDetail({
      id: threadId,
      title,
      body,
      date: threadDate,
      username,
      comments: [threadCommentDetail],
    });

    const expectedThreadDetail = new ThreadDetail({
      id: threadId,
      title,
      body,
      date: threadDate,
      username,
      comments: [threadCommentDetail],
    });

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
