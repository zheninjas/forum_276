import {jest} from '@jest/globals';
import InsertThread from '../../../Domains/threads/entities/InsertThread.js';
import NewThread from '../../../Domains/threads/entities/NewThread.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddThreadUseCase from '../AddThreadUseCase.js';

describe('AddThreadUseCase', () => {
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

    const userAuthCredential = {
      id: userAuthId,
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
    const addedThread = await addThreadUseCase.execute(useCasePayload, userAuthCredential);

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
