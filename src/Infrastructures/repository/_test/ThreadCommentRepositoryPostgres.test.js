import ThreadCommentsTableTestHelper from '../../../../tests/ThreadCommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import InsertThread from '../../../Domains/threads/entities/InsertThread.js';
import InsertThreadComment from '../../../Domains/threads/entities/InsertThreadComment.js';
import NewThreadComment from '../../../Domains/threads/entities/NewThreadComment.js';
import RemoveThreadComment from '../../../Domains/threads/entities/RemoveThreadComment.js';
import pool from '../../database/postgres/pool.js';
import ThreadCommentRepositoryPostgres from '../ThreadCommentRepositoryPostgres.js';

describe('ThreadCommentRepositoryPostgres', () => {
  const username = 'monne';
  const userId = 'user-123';
  const threadId = 'thread-123';
  const insertThread = new InsertThread('Thread Title', 'Thread Body', userId);

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
      const insertThreadComment = new InsertThreadComment(threadId, content, userId);

      const fakeIdGenerator = () => '123';
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadCommentRepositoryPostgres.addComment(insertThreadComment);

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
      const insertThreadComment = new InsertThreadComment(threadId, content, userId);

      const fakeIdGenerator = () => '123';
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newThreadComment = await threadCommentRepositoryPostgres.addComment(insertThreadComment);

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

  describe('getComments function', () => {
    it('should get comments correctly', async () => {
      // Arrange
      const threadCommentOne = {
        id: 'thread-comment-123',
        content: 'comment conten one',
        threadId,
        owner: userId,
        date: '2023-02-25T07:00:00.800Z',
      };

      const threadCommentTwo = {
        id: 'thread-comment-234',
        content: 'comment conten two',
        threadId,
        owner: userId,
        date: '2023-02-25T07:00:00.800Z',
      };

      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool);

      await ThreadCommentsTableTestHelper.addComment({...threadCommentOne});
      await ThreadCommentsTableTestHelper.addComment({...threadCommentTwo});
      await ThreadCommentsTableTestHelper.softDeleteComment({...threadCommentTwo});
      // Action
      const threadComments = await threadCommentRepositoryPostgres.getComments(threadId);

      // Assert
      expect(threadComments).toBeInstanceOf(Array);
      expect(threadComments).toHaveLength(2);
      expect(threadComments).toStrictEqual([
        {
          id: threadCommentOne.id,
          content: threadCommentOne.content,
          username,
          date: threadCommentOne.date,
          is_delete: false,
        },
        {
          id: threadCommentTwo.id,
          content: threadCommentTwo.content,
          username,
          date: threadCommentTwo.date,
          is_delete: true,
        },
      ]);
    });
  });

  describe('softDeleteComment function', () => {
    it('should soft delete comment from thread correctly', async () => {
      // Arrange
      const threadCommentId = 'thread-comment-123';
      const removeThreadComment = new RemoveThreadComment(threadId, threadCommentId, userId);
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool);

      await ThreadCommentsTableTestHelper.addComment({id: threadCommentId});

      // Action
      await threadCommentRepositoryPostgres.softDeleteComment(removeThreadComment);

      // Assert
      const threadComments = await ThreadCommentsTableTestHelper.findThreadCommentsById(threadId, threadCommentId);

      expect(threadComments).toHaveLength(1);
      expect(threadComments[0].is_delete).toEqual(true);
    });

    it('should throw NotFoundError when delete comment failed', async () => {
      // Arrange
      const invalidThreadCommentId = 'thread-comment-xxx';
      const removeThreadComment = new RemoveThreadComment(threadId, invalidThreadCommentId, userId);
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool);

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.softDeleteComment(removeThreadComment)).rejects.toThrow(
        NotFoundError,
      );
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
