import RemoveThreadCommentReply from '../RemoveThreadCommentReply.js';

describe('RemoveThreadCommentReply entity', () => {
  const threadId = 'thread-123';
  const threadCommentId = 'thread-comment-123';
  const threadCommentReplyId = 'thread-comment-reply-123';

  describe('validate data function', () => {
    it('should throw error when parameters does not contain threadId or commentId or replyId', () => {
      // Action & Assert
      expect(() => new RemoveThreadCommentReply(null, threadCommentId, threadCommentReplyId)).toThrowError(
        'REMOVE_THREAD_COMMENT_REPLY.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY',
      );
      expect(() => new RemoveThreadCommentReply(threadId, null, threadCommentReplyId)).toThrowError(
        'REMOVE_THREAD_COMMENT_REPLY.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY',
      );
      expect(() => new RemoveThreadCommentReply(threadId, threadCommentId, null)).toThrowError(
        'REMOVE_THREAD_COMMENT_REPLY.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY',
      );
    });

    it('should throw error when parameters threadId or commentId or replyId not meet data type specification', () => {
      // Action & Assert
      expect(() => new RemoveThreadCommentReply(123, threadCommentId, threadCommentReplyId)).toThrowError(
        'REMOVE_THREAD_COMMENT_REPLY.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
      expect(() => new RemoveThreadCommentReply(threadId, 123, threadCommentReplyId)).toThrowError(
        'REMOVE_THREAD_COMMENT_REPLY.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
      expect(() => new RemoveThreadCommentReply(threadId, threadCommentId, 123)).toThrowError(
        'REMOVE_THREAD_COMMENT_REPLY.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    });

    it('should throw error when parameters does not contain userId', () => {
      // Action & Assert
      expect(() => new RemoveThreadCommentReply(threadId, threadCommentId, threadCommentReplyId, null)).toThrowError(
        'REMOVE_THREAD_COMMENT_REPLY.USER_ID_NOT_FOUND',
      );
    });

    it('should throw error when parameters userId not meet data type specification', () => {
      // Action & Assert
      expect(() => new RemoveThreadCommentReply(threadId, threadCommentId, threadCommentReplyId, 123)).toThrowError(
        'REMOVE_THREAD_COMMENT_REPLY.WRONG_USER_ID_DATA_TYPE',
      );
    });
  });

  it('should create RemoveThreadCommentReply entity correctly', () => {
    // Arrange
    const userId = 'user-123';

    // Action
    const insertReply = new RemoveThreadCommentReply(threadId, threadCommentId, threadCommentReplyId, userId);

    // Assert
    expect(insertReply).toBeInstanceOf(RemoveThreadCommentReply);
    expect(insertReply.threadId).toEqual(threadId);
    expect(insertReply.threadCommentId).toEqual(threadCommentId);
    expect(insertReply.threadCommentReplyId).toEqual(threadCommentReplyId);
    expect(insertReply.userId).toEqual(userId);
  });
});
