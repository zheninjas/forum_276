import ThreadCommentsTableTestHelper from '../../../../tests/ThreadCommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
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

    it('should return new thread comment correctly', async () => {
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

  describe('softDeleteComment function', () => {
    it('should soft delete comment from thread correctly', async () => {
      // Arrange
      const threadCommentId = 'thread-comment-123';
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool);

      await ThreadCommentsTableTestHelper.addComment({id: threadCommentId});

      // Action
      await threadCommentRepositoryPostgres.softDeleteComment(threadCommentId, threadId, userId);

      // Assert
      const threadComments = await ThreadCommentsTableTestHelper.findThreadCommentsById(threadId, threadCommentId);

      expect(threadComments).toHaveLength(1);
      expect(threadComments[0].is_delete).toEqual(true);
    });

    it('should throw NotFoundError when delete comment failed', async () => {
      // Arrange
      const invalidThreadCommentId = 'thread-comment-xxx';
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool);

      // Action & Assert
      await expect(
        threadCommentRepositoryPostgres.softDeleteComment(invalidThreadCommentId, threadId, userId),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when user not authorized the thread comment', async () => {
      // Arrange
      const otherUserId = 'user-234';
      const threadCommentId = 'thread-comment-123';

      await ThreadCommentsTableTestHelper.addComment({
        id: threadCommentId,
        content: 'comment content',
        threadId,
        owner: userId,
      });

      await UsersTableTestHelper.addUser({
        id: otherUserId,
        username: 'other_username',
        password: 'other_password',
        fullname: 'Other Name',
      });

      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool);

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyCommentOwner(threadCommentId, otherUserId)).rejects.toThrow(
        AuthorizationError,
      );
    });

    it('should not throw AuthorizationError when user is the owner of thread comment', async () => {
      // Arrange
      const threadCommentId = 'thread-comment-123';
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool);

      await ThreadCommentsTableTestHelper.addComment({
        id: threadCommentId,
        content: 'comment content',
        threadId,
        owner: userId,
      });

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyCommentOwner(threadCommentId, userId)).resolves.not.toThrow(
        AuthorizationError,
      );
    });
  });

  describe('verifyComment function', () => {
    it('should throw NotFoundError when thread for comment not found', async () => {
      // Arrange
      const threadCommentId = 'thread-comment-123';

      await ThreadCommentsTableTestHelper.addComment({
        id: threadCommentId,
        content: 'comment content',
        threadId,
        owner: userId,
      });

      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool);

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyComment(threadCommentId, 'thread-xxx')).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool);

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyComment('thread-comment-xxx', threadId)).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should not throw NotFoundError when comment exist', async () => {
      // Arrange
      const threadCommentId = 'thread-comment-123';

      await ThreadCommentsTableTestHelper.addComment({
        id: threadCommentId,
        content: 'comment content',
        threadId: threadId,
        owner: userId,
      });

      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool);

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyComment(threadCommentId, threadId)).resolves.not.toThrow(
        NotFoundError,
      );
    });
  });
});
