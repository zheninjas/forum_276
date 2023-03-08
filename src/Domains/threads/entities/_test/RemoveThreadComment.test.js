import RemoveThreadComment from '../RemoveThreadComment.js';

describe('RemoveThreadComment entity', () => {
  const threadId = 'thread-123';
  const threadCommentId = 'thread-comment-123';
  const userId = 'user-123';

  describe('validate data function', () => {
    it('should throw error when parameters does not contain threadId or commentId', () => {
      // Action & Assert
      expect(() => new RemoveThreadComment(null, threadCommentId)).toThrowError(
        'REMOVE_THREAD_COMMENT.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY',
      );
      expect(() => new RemoveThreadComment(threadId, null)).toThrowError(
        'REMOVE_THREAD_COMMENT.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY',
      );
    });

    it('should throw error when parameters threadId or commentId or replyId not meet data type specification', () => {
      // Action & Assert
      expect(() => new RemoveThreadComment(123, threadCommentId)).toThrowError(
        'REMOVE_THREAD_COMMENT.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
      expect(() => new RemoveThreadComment(threadId, 123)).toThrowError(
        'REMOVE_THREAD_COMMENT.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    });

    it('should throw error when parameters does not contain userId', () => {
      // Action & Assert
      expect(() => new RemoveThreadComment(threadId, threadCommentId, null)).toThrowError(
        'REMOVE_THREAD_COMMENT.USER_ID_NOT_FOUND',
      );
    });

    it('should throw error when parameters userId not meet data type specification', () => {
      // Action & Assert
      expect(() => new RemoveThreadComment(threadId, threadCommentId, 123)).toThrowError(
        'REMOVE_THREAD_COMMENT.WRONG_USER_ID_DATA_TYPE',
      );
    });
  });

  it('should create RemoveThreadComment entity correctly', () => {
    // Action
    const insertReply = new RemoveThreadComment(threadId, threadCommentId, userId);

    // Assert
    expect(insertReply).toBeInstanceOf(RemoveThreadComment);
    expect(insertReply.threadId).toEqual(threadId);
    expect(insertReply.threadCommentId).toEqual(threadCommentId);
    expect(insertReply.userId).toEqual(userId);
  });
});
