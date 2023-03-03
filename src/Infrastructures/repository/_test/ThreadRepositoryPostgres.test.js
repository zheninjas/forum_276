import ThreadCommentRepliesTableTestHelper from '../../../../tests/ThreadCommentRepliesTableTestHelper.js';
import ThreadCommentsTableTestHelper from '../../../../tests/ThreadCommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import InsertThread from '../../../Domains/threads/entities/InsertThread.js';
import NewThread from '../../../Domains/threads/entities/NewThread.js';
import ThreadCommentDetail from '../../../Domains/threads/entities/ThreadCommentDetail.js';
import ThreadCommentReplyDetail from '../../../Domains/threads/entities/ThreadCommentReplyDetail.js';
import ThreadDetail from '../../../Domains/threads/entities/ThreadDetail.js';
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

  describe('getThreadWithComments function', () => {
    it('should get thread with comments correctly', async () => {
      // Arrange
      const userOne = {
        id: 'user-123',
        username: 'monne',
      };

      const userTwo = {
        id: 'user-234',
        username: 'horamie',
      };

      const thread = {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread Body',
        owner: userOne.id,
        date: '2023-02-25T07:00:00.800Z',
      };

      const threadCommentOne = {
        id: 'thread-comment-123',
        content: 'comment content one',
        threadId: thread.id,
        owner: userOne.id,
        date: '2023-02-25T08:00:00.800Z',
      };

      const threadCommentTwo = {
        id: 'thread-comment-234',
        content: 'comment content two',
        threadId: thread.id,
        owner: userTwo.id,
        date: '2023-02-25T08:10:00.800Z',
      };

      const threadCommentTwoReply = {
        id: 'thread-comment-reply-123',
        content: 'reply comment content two',
        threadCommentId: threadCommentTwo.id,
        owner: userOne.id,
        date: '2023-02-25T08:15:00.800Z',
      };

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      await UsersTableTestHelper.addUser({...userOne});
      await UsersTableTestHelper.addUser({...userTwo});
      await ThreadsTableTestHelper.addThread({...thread});
      await ThreadCommentsTableTestHelper.addComment({...threadCommentOne});
      await ThreadCommentsTableTestHelper.addComment({...threadCommentTwo});
      await ThreadCommentRepliesTableTestHelper.addReply({...threadCommentTwoReply});

      // Action
      const threadDetail = await threadRepositoryPostgres.getThreadWithComments(thread.id);

      // Assert
      expect(threadDetail).toStrictEqual(
        new ThreadDetail({
          id: thread.id,
          title: thread.title,
          body: thread.body,
          date: thread.date,
          username: userOne.username,
          comments: [
            new ThreadCommentDetail({
              id: threadCommentOne.id,
              username: userOne.username,
              date: threadCommentOne.date,
              content: threadCommentOne.content,
              is_delete: false,
              replies: [],
            }),
            new ThreadCommentDetail({
              id: threadCommentTwo.id,
              username: userTwo.username,
              date: threadCommentTwo.date,
              content: threadCommentTwo.content,
              is_delete: false,
              replies: [
                new ThreadCommentReplyDetail({
                  id: threadCommentTwoReply.id,
                  username: userOne.username,
                  date: threadCommentTwoReply.date,
                  content: threadCommentTwoReply.content,
                  is_delete: false,
                }),
              ],
            }),
          ],
        }),
      );
    });

    it('should return thread detail with empty comments correctly', async () => {
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
      const threadDetail = await threadRepositoryPostgres.getThreadWithComments(thread.id);

      // Assert
      expect(threadDetail.comments).toHaveLength(0);
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
