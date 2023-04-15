import ToggleThreadCommentLike from '../ToggleThreadCommentLike.js';

describe('ToggleThreadCommentLike entity', () => {
  const threadId = 'thread-123';
  const threadCommentId = 'thread-comment-123';
  const userId = 'user-123';

  describe('validate data function', () => {
    it('should throw error when parameters does not contain threadId or commentId', () => {
      // Action & Assert
      expect(() => new ToggleThreadCommentLike(null, threadCommentId)).toThrowError(
        'TOGGLE_THREAD_COMMENT_LIKE.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY',
      );
      expect(() => new ToggleThreadCommentLike(threadId, null)).toThrowError(
        'TOGGLE_THREAD_COMMENT_LIKE.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY',
      );
    });

    it('should throw error when parameters threadId or commentId or replyId not meet data type specification', () => {
      // Action & Assert
      expect(() => new ToggleThreadCommentLike(123, threadCommentId)).toThrowError(
        'TOGGLE_THREAD_COMMENT_LIKE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
      expect(() => new ToggleThreadCommentLike(threadId, 123)).toThrowError(
        'TOGGLE_THREAD_COMMENT_LIKE.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    });

    it('should throw error when parameters does not contain userId', () => {
      // Action & Assert
      expect(() => new ToggleThreadCommentLike(threadId, threadCommentId, null)).toThrowError(
        'TOGGLE_THREAD_COMMENT_LIKE.USER_ID_NOT_FOUND',
      );
    });

    it('should throw error when parameters userId not meet data type specification', () => {
      // Action & Assert
      expect(() => new ToggleThreadCommentLike(threadId, threadCommentId, 123)).toThrowError(
        'TOGGLE_THREAD_COMMENT_LIKE.WRONG_USER_ID_DATA_TYPE',
      );
    });
  });

  it('should create ToggleThreadCommentLike entity correctly', () => {
    // Action
    const insertReply = new ToggleThreadCommentLike(threadId, threadCommentId, userId);

    // Assert
    expect(insertReply).toBeInstanceOf(ToggleThreadCommentLike);
    expect(insertReply.threadId).toEqual(threadId);
    expect(insertReply.threadCommentId).toEqual(threadCommentId);
    expect(insertReply.userId).toEqual(userId);
  });
});
