import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import InsertThread from '../../../Domains/threads/entities/InsertThread.js';
import NewThread from '../../../Domains/threads/entities/NewThread.js';
import pool from '../../database/postgres/pool.js';
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js';

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should add thread correctly', async () => {
      // Arrange
      const insertThread = new InsertThread({
        title: 'Thread Title',
        body: 'Thread Body',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({id: 'user-123', username: 'monne'});

      // Action
      await threadRepositoryPostgres.addThread(insertThread, 'user-123');

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');

      expect(threads).toHaveLength(1);
    });

    it('should return new thread correctly', async () => {
      const insertThread = new InsertThread({
        title: 'Thread Title',
        body: 'Thread Body',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({id: 'user-123', username: 'monne'});

      // Action
      const newThread = await threadRepositoryPostgres.addThread(insertThread, 'user-123');

      // Assert
      expect(newThread).toStrictEqual(
        new NewThread({
          id: 'thread-123',
          title: insertThread.title,
          owner: 'user-123',
        }),
      );
    });
  });

  describe('verifyThread function', () => {
    it('should throw NotFoundError if thread not exist', async () => {
      // Arrange
      const threadId = 'thread-123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThread(threadId)).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if thread exist', async () => {
      // Arrange
      const threadId = 'thread-123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      await UsersTableTestHelper.addUser({username: 'monne'});
      await ThreadsTableTestHelper.addThread({id: threadId});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThread(threadId)).resolves.not.toThrow(NotFoundError);
    });
  });
});
