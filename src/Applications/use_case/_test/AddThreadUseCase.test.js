import {jest} from '@jest/globals';
import InsertThread from '../../../Domains/threads/entities/InsertThread.js';
import NewThread from '../../../Domains/threads/entities/NewThread.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddThreadUseCase from '../AddThreadUseCase.js';

describe('AddThreadUseCase', () => {
  describe('_validateUserId function', () => {
    it('should throw error if userId undefined', async () => {
      // Arrange
      const useCasePayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };

      const addThreadUseCase = new AddThreadUseCase({});

      // Action & Assert
      await expect(addThreadUseCase.execute(useCasePayload)).rejects.toThrowError(
        'ADD_THREAD_USE_CASE.USER_ID_NOT_FOUND',
      );
    });

    it('should throw error if userId not string', async () => {
      // Arrange
      const useCasePayload = {
        title: 'Thread Title',
        body: 'Thread Body',
      };

      const userId = 123;
      const addThreadUseCase = new AddThreadUseCase({});

      // Action & Assert
      await expect(addThreadUseCase.execute(useCasePayload, userId)).rejects.toThrowError(
        'ADD_THREAD_USE_CASE.WRONG_USER_ID_DATA_TYPE',
      );
    });
  });

  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const title = 'Thread Title';
    const body = 'Thread Body';
    const userAuthId = 'user-123';
    const threadId = 'thread-123';

    const useCasePayload = {
      title,
      body,
    };

    const mockNewThread = new NewThread({
      id: threadId,
      title,
      owner: userAuthId,
    });

    const expectedNewThread = new NewThread({
      id: threadId,
      title,
      owner: userAuthId,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(mockNewThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload, userAuthId);

    // Assert
    expect(addedThread).toStrictEqual(expectedNewThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new InsertThread({
        title,
        body,
      }),
      userAuthId,
    );
  });
});
