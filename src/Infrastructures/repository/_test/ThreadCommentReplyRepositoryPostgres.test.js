import ThreadCommentRepliesTableTestHelper from '../../../../tests/ThreadCommentRepliesTableTestHelper.js';
import ThreadCommentsTableTestHelper from '../../../../tests/ThreadCommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import InsertThreadCommentReply from '../../../Domains/threads/entities/InsertThreadCommentReply.js';
import NewThreadCommentReply from '../../../Domains/threads/entities/NewThreadCommentReply.js';
import RemoveThreadCommentReply from '../../../Domains/threads/entities/RemoveThreadCommentReply.js';
import pool from '../../database/postgres/pool.js';
import ThreadCommentReplyRepositoryPostgres from '../ThreadCommentReplyRepositoryPostgres.js';

describe('ThreadCommentReplyRepositoryPostgres', () => {
  const username = 'monne';
  const userId = 'user-123';
  const threadId = 'thread-123';
  const threadCommentId = 'thread-comment-123';
  const insertThread = {
    title: 'Thread Title',
    body: 'Thread Body',
  };

  const insertComment = {
    content: 'comment content',
  };

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({id: userId, username});
    await ThreadsTableTestHelper.addThread({id: threadId, ...insertThread});
    await ThreadCommentsTableTestHelper.addComment({id: threadCommentId, threadId, ...insertComment});
  });

  afterEach(async () => {
    await ThreadCommentRepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should add comment to thread correctly', async () => {
      // Arrange
      const content = 'comment content reply';
      const expectedThreadCommentId = 'thread-comment-reply-123';
      const insertThreadCommentReply = new InsertThreadCommentReply(threadId, threadCommentId, content, userId);

      const fakeIdGenerator = () => '123';
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadCommentReplyRepositoryPostgres.addReply(insertThreadCommentReply);

      // Assert
      const threadCommentReplies = await ThreadCommentRepliesTableTestHelper.findThreadCommentRepliesById(
        threadCommentId,
        expectedThreadCommentId,
      );

      expect(threadCommentReplies).toHaveLength(1);
    });

    it('should return new comment reply correctly', async () => {
      // Arrange
      const content = 'comment content reply';
      const expectedThreadCommentId = 'thread-comment-reply-123';
      const insertThreadCommentReply = new InsertThreadCommentReply(threadId, threadCommentId, content, userId);

      const fakeIdGenerator = () => '123';
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newThreadCommentReply = await threadCommentReplyRepositoryPostgres.addReply(insertThreadCommentReply);

      // Assert
      expect(newThreadCommentReply).toStrictEqual(
        new NewThreadCommentReply({
          id: expectedThreadCommentId,
          content,
          owner: userId,
        }),
      );
    });
  });

  describe('getRepliesByCommentIds function', () => {
    it('should get replies by comment ids correctly', async () => {
      // Arrange
      const threadCommentTwo = {
        id: 'thread-comment-234',
        content: 'comment conten two',
        threadId,
        owner: userId,
        date: '2023-02-25T07:00:00.800Z',
      };

      const threadCommentThree = {
        id: 'thread-comment-345',
        content: 'comment conten two',
        threadId,
        owner: userId,
        date: '2023-02-25T07:00:00.800Z',
      };

      const threadCommentOneReplyOne = {
        id: 'thread-comment-reply-123',
        content: 'reply comment content one',
        threadCommentId: threadCommentId,
        owner: userId,
        date: '2023-02-25T08:10:00.800Z',
      };

      const threadCommentTwoReplyOne = {
        id: 'thread-comment-reply-234',
        content: 'reply comment content two',
        threadCommentId: threadCommentTwo.id,
        owner: userId,
        date: '2023-02-25T08:15:00.800Z',
      };

      const threadCommentTwoReplyTwo = {
        id: 'thread-comment-reply-345',
        content: 'reply two comment content two',
        threadCommentId: threadCommentTwo.id,
        owner: userId,
        date: '2023-02-25T08:20:00.800Z',
      };

      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool);

      await ThreadCommentsTableTestHelper.addComment({...threadCommentTwo});
      await ThreadCommentsTableTestHelper.addComment({...threadCommentThree});
      await ThreadCommentRepliesTableTestHelper.addReply({...threadCommentOneReplyOne});
      await ThreadCommentRepliesTableTestHelper.addReply({...threadCommentTwoReplyOne});
      await ThreadCommentRepliesTableTestHelper.addReply({...threadCommentTwoReplyTwo});
      await ThreadCommentRepliesTableTestHelper.softDeleteReply({...threadCommentTwoReplyTwo});

      // Action
      const threadRepliesComments = await threadCommentReplyRepositoryPostgres.getRepliesByCommentIds([
        threadCommentId,
        threadCommentTwo.id,
        threadCommentThree.id,
      ]);

      // Assert
      expect(threadRepliesComments).toBeInstanceOf(Array);
      expect(threadRepliesComments).toHaveLength(3);
      expect(threadRepliesComments).toStrictEqual([
        {
          id: threadCommentOneReplyOne.id,
          content: threadCommentOneReplyOne.content,
          username,
          date: threadCommentOneReplyOne.date,
          thread_comment_id: threadCommentId,
          is_delete: false,
        },
        {
          id: threadCommentTwoReplyOne.id,
          content: threadCommentTwoReplyOne.content,
          username,
          date: threadCommentTwoReplyOne.date,
          thread_comment_id: threadCommentTwo.id,
          is_delete: false,
        },
        {
          id: threadCommentTwoReplyTwo.id,
          content: threadCommentTwoReplyTwo.content,
          username,
          date: threadCommentTwoReplyTwo.date,
          thread_comment_id: threadCommentTwo.id,
          is_delete: true,
        },
      ]);
    });
  });

  describe('softDeleteReply function', () => {
    it('should soft delete comment reply from thread correctly', async () => {
      // Arrange
      const threadCommentReplyId = 'thread-comment-reply-123';
      const removeThreadCommentReply = new RemoveThreadCommentReply(
        threadId,
        threadCommentId,
        threadCommentReplyId,
        userId,
      );

      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool);

      await ThreadCommentRepliesTableTestHelper.addReply({id: threadCommentReplyId});

      // Action
      await threadCommentReplyRepositoryPostgres.softDeleteReply(removeThreadCommentReply);

      // Assert
      const threadCommentReplies = await ThreadCommentRepliesTableTestHelper.findThreadCommentRepliesById(
        threadCommentId,
        threadCommentReplyId,
      );

      expect(threadCommentReplies).toHaveLength(1);
      expect(threadCommentReplies[0].is_delete).toEqual(true);
    });

    it('should throw NotFoundError when delete comment reply failed', async () => {
      // Arrange
      const invalidThreadCommentReplyId = 'thread-comment-reply-xxx';
      const removeThreadCommentReply = new RemoveThreadCommentReply(
        threadId,
        threadCommentId,
        invalidThreadCommentReplyId,
        userId,
      );

      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool);

      // Action & Assert
      await expect(threadCommentReplyRepositoryPostgres.softDeleteReply(removeThreadCommentReply)).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when user not authorized the thread comment reply', async () => {
      // Arrange
      const otherUserId = 'user-234';
      const threadCommentReplyId = 'thread-comment-reply-123';

      await ThreadCommentRepliesTableTestHelper.addReply({
        id: threadCommentReplyId,
        content: 'comment content reply',
        threadCommentId,
        owner: userId,
      });

      await UsersTableTestHelper.addUser({
        id: otherUserId,
        username: 'other_username',
        password: 'other_password',
        fullname: 'Other Name',
      });

      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool);

      // Action & Assert
      await expect(
        threadCommentReplyRepositoryPostgres.verifyReplyOwner(threadCommentReplyId, otherUserId),
      ).rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when user is the owner of thread comment reply', async () => {
      // Arrange
      const threadCommentReplyId = 'thread-comment-reply-123';
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool);

      await ThreadCommentRepliesTableTestHelper.addReply({
        id: threadCommentReplyId,
        content: 'comment content reply',
        threadCommentId,
        owner: userId,
      });

      // Action & Assert
      await expect(
        threadCommentReplyRepositoryPostgres.verifyReplyOwner(threadCommentReplyId, userId),
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('verifyThreadCommentReply function', () => {
    it('should throw NotFoundError when thread for comment reply not found', async () => {
      // Arrange
      const threadCommentReplyId = 'thread-comment-reply-123';

      await ThreadCommentRepliesTableTestHelper.addReply({
        id: threadCommentReplyId,
        content: 'comment content reply',
        threadCommentId,
        owner: userId,
      });

      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool);

      // Action & Assert
      await expect(
        threadCommentReplyRepositoryPostgres.verifyThreadCommentReply(
          threadCommentReplyId,
          threadCommentId,
          'thread-xxx',
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when thread comment for reply not found', async () => {
      // Arrange
      const threadCommentReplyId = 'thread-comment-reply-123';

      await ThreadCommentRepliesTableTestHelper.addReply({
        id: threadCommentReplyId,
        content: 'comment content reply',
        threadCommentId,
        owner: userId,
      });

      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool);

      // Action & Assert
      await expect(
        threadCommentReplyRepositoryPostgres.verifyThreadCommentReply(
          threadCommentReplyId,
          'thread-comment-xxx',
          threadId,
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when comment reply not found', async () => {
      // Arrange
      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool);

      // Action & Assert
      await expect(
        threadCommentReplyRepositoryPostgres.verifyThreadCommentReply(
          'thread-comment-reply-xxx',
          threadCommentId,
          threadId,
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when comment reply exist', async () => {
      // Arrange
      const threadCommentReplyId = 'thread-comment-reply-123';

      await ThreadCommentRepliesTableTestHelper.addReply({
        id: threadCommentReplyId,
        content: 'comment content',
        threadCommentId,
        owner: userId,
      });

      const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool);

      // Action & Assert
      await expect(
        threadCommentReplyRepositoryPostgres.verifyThreadCommentReply(threadCommentReplyId, threadCommentId, threadId),
      ).resolves.not.toThrow(NotFoundError);
    });
  });
});
