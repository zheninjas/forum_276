import ThreadCommentsTableTestHelper from '../../../../tests/ThreadCommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import InsertThread from '../../../Domains/threads/entities/InsertThread.js';
import NewThreadComment from '../../../Domains/threads/entities/NewThreadComment.js';
import pool from '../../database/postgres/pool.js';
import ThreadCommentRepositoryPostgres from '../ThreadCommentRepositoryPostgres.js';

describe('ThreadCommentRepositoryPostgres', () => {
  const username = 'monne';
  const userId = 'user-123';
  const threadId = 'thread-123';
  const insertThread = new InsertThread({
    title: 'Thread Title',
    body: 'Thread Body',
  });

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({username, userId});
    await ThreadsTableTestHelper.addThread(insertThread, threadId);
  });

  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should add comment to thread correctly', async () => {
      // Arrange
      const content = 'comment content';
      const expectedThreadCommentId = 'thread-comment-123';

      const fakeIdGenerator = () => '123';
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadCommentRepositoryPostgres.addComment(content, threadId, userId);

      // Assert
      const threadComments = await ThreadCommentsTableTestHelper.findThreadCommentsById(
        threadId,
        expectedThreadCommentId,
      );

      expect(threadComments).toHaveLength(1);
    });

    it('should return new comment correctly', async () => {
      // Arrange
      const content = 'comment content';
      const expectedThreadCommentId = 'thread-comment-123';

      const fakeIdGenerator = () => '123';
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newThreadComment = await threadCommentRepositoryPostgres.addComment(content, threadId, userId);

      // Assert
      expect(newThreadComment).toStrictEqual(
        new NewThreadComment({
          id: expectedThreadCommentId,
          content,
          owner: userId,
        }),
      );
    });
  });
});
