import {jest} from '@jest/globals';
import ThreadCommentDetail from '../../../Domains/threads/entities/ThreadCommentDetail.js';
import ThreadCommentReplyDetail from '../../../Domains/threads/entities/ThreadCommentReplyDetail.js';
import ThreadDetail from '../../../Domains/threads/entities/ThreadDetail.js';
import ThreadCommentLikeRepository from '../../../Domains/threads/ThreadCommentLikeRepository.js';
import ThreadCommentReplyRepository from '../../../Domains/threads/ThreadCommentReplyRepository.js';
import ThreadCommentRepository from '../../../Domains/threads/ThreadCommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import GetThreadUseCase from '../GetThreadUseCase.js';

describe('GetThreadUseCase', () => {
  describe('validate params function', () => {
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
    const threadCommentId = 'thread-comment-123';

    const useCaseParams = {
      threadId,
    };

    // Arrange
    const thread = () => ({
      id: threadId,
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2023-02-25T07:00:00.800Z',
      username: 'user-123',
    });

    const comment = () => ({
      id: threadCommentId,
      username: 'user-123',
      date: '2023-02-25T08:00:00.800Z',
      content: 'comment content one',
      is_delete: true,
    });

    const reply = () => ({
      id: 'thread-comment-reply-123',
      username: 'user-234',
      date: '2023-02-25T08:10:00.800Z',
      content: 'reply one comment two',
      thread_comment_id: threadCommentId,
      is_delete: true,
    });

    const like = () => ({
      thread_comment_id: threadCommentId,
      like_count: 5,
    });

    const mockThread = thread();
    const mockComments = [comment()];
    const mockLikes = [like()];
    const mockReplies = [reply()];

    const expectedThreadDetail = new ThreadDetail({
      ...thread(),
      comments: [
        new ThreadCommentDetail({
          ...comment(),
          like_count: 5,
          replies: [new ThreadCommentReplyDetail(reply())],
        }),
      ],
    });

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadCommentLikeRepository = new ThreadCommentLikeRepository();
    const mockThreadCommentReplyRepository = new ThreadCommentReplyRepository();

    mockThreadRepository.verifyThread = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThread = jest.fn(() => Promise.resolve(mockThread));
    mockThreadCommentRepository.getComments = jest.fn(() => Promise.resolve(mockComments));
    mockThreadCommentLikeRepository.getLikesByCommentIds = jest.fn(() => Promise.resolve(mockLikes));
    mockThreadCommentReplyRepository.getRepliesByCommentIds = jest.fn(() => Promise.resolve(mockReplies));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      threadCommentLikeRepository: mockThreadCommentLikeRepository,
      threadCommentReplyRepository: mockThreadCommentReplyRepository,
    });

    // Action
    const threadDetail = await getThreadUseCase.execute(useCaseParams);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetail);
    expect(mockThreadRepository.verifyThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThread).toBeCalledWith(threadId);
    expect(mockThreadCommentRepository.getComments).toBeCalledWith(threadId);
    expect(mockThreadCommentLikeRepository.getLikesByCommentIds).toBeCalledWith([threadCommentId]);
    expect(mockThreadCommentReplyRepository.getRepliesByCommentIds).toBeCalledWith([threadCommentId]);
  });
});
