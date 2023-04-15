import ThreadCommentLikesTableTestHelper from '../../../../tests/ThreadCommentLikesTableTestHelper.js';
import ThreadCommentsTableTestHelper from '../../../../tests/ThreadCommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import ToggleThreadCommentLike from '../../../Domains/threads/entities/ToggleThreadCommentLike.js';
import pool from '../../database/postgres/pool.js';
import ThreadCommentLikeRepositoryPostgres from '../ThreadCommentLikeRepositoryPostgres.js';

describe('ThreadCommentLikeRepositoryPostgres', () => {
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
    await ThreadCommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('getLikeId function', () => {
    it('should return comment like id correctly', async () => {
      // Arrange
      const expectedThreadCommentId = 'thread-comment-like-123';

      const threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool);

      await ThreadCommentLikesTableTestHelper.addLike({
        id: expectedThreadCommentId,
        threadCommentId,
        userId,
      });

      // Action
      const threadCommentLikeId = await threadCommentLikeRepositoryPostgres.getLikeId(threadCommentId, userId);

      // Assert
      expect(threadCommentLikeId).toEqual(expectedThreadCommentId);
    });

    it('should return null comment like id correctly', async () => {
      // Arrange
      const threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool);

      // Action
      const threadCommentLikeId = await threadCommentLikeRepositoryPostgres.getLikeId(threadCommentId, userId);

      // Assert
      expect(threadCommentLikeId).toEqual(null);
    });
  });

  describe('getLikesByCommentIds function', () => {
    it('should get likes by comment ids correctly', async () => {
      // Arrange
      const userTwo = {
        id: 'user-234',
        username: 'user_two',
      };

      const threadCommentTwo = {
        id: 'thread-comment-234',
        content: 'comment conten two',
        threadId,
        owner: userId,
        date: '2023-02-25T07:00:00.800Z',
      };

      const threadCommentOneLike = {
        id: 'thread-comment-like-123',
        threadCommentId: threadCommentId,
        userId,
      };

      const threadCommentTwoLikeOne = {
        id: 'thread-comment-like-234',
        threadCommentId: threadCommentTwo.id,
        userId,
      };

      const threadCommentTwoLikeTwo = {
        id: 'thread-comment-like-345',
        threadCommentId: threadCommentTwo.id,
        userId: userTwo.id,
      };

      const threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool);

      await UsersTableTestHelper.addUser({...userTwo});
      await ThreadCommentsTableTestHelper.addComment({...threadCommentTwo});
      await ThreadCommentLikesTableTestHelper.addLike({...threadCommentOneLike});
      await ThreadCommentLikesTableTestHelper.addLike({...threadCommentTwoLikeOne});
      await ThreadCommentLikesTableTestHelper.addLike({...threadCommentTwoLikeTwo});

      // Action
      const threadCommentLikes = await threadCommentLikeRepositoryPostgres.getLikesByCommentIds([
        threadCommentId,
        threadCommentTwo.id,
      ]);

      // Assert
      expect(threadCommentLikes).toBeInstanceOf(Array);
      expect(threadCommentLikes).toHaveLength(2);
      expect(threadCommentLikes).toStrictEqual([
        {
          like_count: 1,
          thread_comment_id: threadCommentId,
        },
        {
          like_count: 2,
          thread_comment_id: threadCommentTwo.id,
        },
      ]);

      // Clean up users
      await UsersTableTestHelper.deleteUser(userTwo.id);
    });
  });

  describe('insertLike function', () => {
    it('should add thread comment like correctly', async () => {
      // Arrange
      const expectedThreadCommentLikeId = 'thread-comment-like-123';
      const toggleThreadCommentLike = new ToggleThreadCommentLike(threadId, threadCommentId, userId);

      const fakeIdGenerator = () => '123';
      const threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadCommentLikeRepositoryPostgres.insertLike(toggleThreadCommentLike);

      // Assert
      const threadCommentLikes = await ThreadCommentLikesTableTestHelper.getLike(expectedThreadCommentLikeId);

      expect(threadCommentLikes).toHaveLength(1);
    });
  });

  describe('removeLike function', () => {
    it('should delete thread comment like correctly', async () => {
      // Arrange
      const threadCommentLikeId = 'thread-comment-like-123';

      const threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool);

      await ThreadCommentLikesTableTestHelper.addLike({
        id: threadCommentLikeId,
        threadCommentId,
        userId,
      });

      // Action
      await threadCommentLikeRepositoryPostgres.removeLike(threadCommentLikeId);

      // Assert
      const threadCommentLikes = await ThreadCommentLikesTableTestHelper.getLike(threadCommentLikeId);

      expect(threadCommentLikes).toHaveLength(0);
    });
  });
});
