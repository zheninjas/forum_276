import ThreadCommentRepliesTableTestHelper from '../../../../tests/ThreadCommentRepliesTableTestHelper.js';
import ThreadCommentsTableTestHelper from '../../../../tests/ThreadCommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import InsertThread from '../../../Domains/threads/entities/InsertThread.js';
import NewThread from '../../../Domains/threads/entities/NewThread.js';
import pool from '../../database/postgres/pool.js';
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js';

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadCommentRepliesTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should add thread correctly', async () => {
      // Arrange
      const userId = 'user-123';
      const insertThread = new InsertThread('Thread Title', 'Thread Body', userId);

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({id: userId, username: 'monne'});

      // Action
      await threadRepositoryPostgres.addThread(insertThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');

      expect(threads).toHaveLength(1);
    });

    it('should return new thread correctly', async () => {
      const userId = 'user-123';
      const insertThread = new InsertThread('Thread Title', 'Thread Body', userId);

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({id: userId, username: 'monne'});

      // Action
      const newThread = await threadRepositoryPostgres.addThread(insertThread);

      // Assert
      expect(newThread).toStrictEqual(
        new NewThread({
          id: 'thread-123',
          title: insertThread.title,
          owner: userId,
        }),
      );
    });
  });

  describe('getThread function', () => {
    it('should get thread correctly', async () => {
      // Arrange
      const user = {
        id: 'user-123',
        username: 'monne',
      };

      const thread = {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread Body',
        owner: user.id,
        date: '2023-02-25T07:00:00.800Z',
      };

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      await UsersTableTestHelper.addUser({...user});
      await ThreadsTableTestHelper.addThread({...thread});

      // Action
      const threadDetail = await threadRepositoryPostgres.getThread(thread.id);

      // Assert
      expect(threadDetail).toStrictEqual({
        id: thread.id,
        title: thread.title,
        body: thread.body,
        date: thread.date,
        username: user.username,
      });
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
