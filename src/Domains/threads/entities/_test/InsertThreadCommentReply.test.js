import InsertThreadCommentReply from '../InsertThreadCommentReply.js';

describe('InsertThreadCommentReply entity', () => {
  const threadId = 'thread-123';
  const threadCommentId = 'thread-comment-123';
  const content = 'comment content';

  describe('validate data function', () => {
    it('should throw error when parameters does not contain threadId or commentId', () => {
      // Action & Assert
      expect(() => new InsertThreadCommentReply(threadId, null)).toThrowError(
        'INSERT_THREAD_COMMENT_REPLY.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY',
      );
      expect(() => new InsertThreadCommentReply(null, threadCommentId)).toThrowError(
        'INSERT_THREAD_COMMENT_REPLY.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY',
      );
    });

    it('should throw error when parameters threadId or commentId not meet data type specification', () => {
      // Action & Assert
      expect(() => new InsertThreadCommentReply(threadId, 123)).toThrowError(
        'INSERT_THREAD_COMMENT_REPLY.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
      expect(() => new InsertThreadCommentReply(123, threadCommentId)).toThrowError(
        'INSERT_THREAD_COMMENT_REPLY.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    });

    it('should throw error when parameters does not contain content', () => {
      // Action & Assert
      expect(() => new InsertThreadCommentReply(threadId, threadCommentId, null)).toThrowError(
        'INSERT_THREAD_COMMENT_REPLY.PAYLOAD_NOT_CONTAIN_CONTENT',
      );
    });

    it('should throw error when parameters content not meet data type specification', () => {
      // Action & Assert
      expect(() => new InsertThreadCommentReply(threadId, threadCommentId, 123)).toThrowError(
        'INSERT_THREAD_COMMENT_REPLY.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    });

    it('should throw error when parameters does not contain userId', () => {
      // Action & Assert
      expect(() => new InsertThreadCommentReply(threadId, threadCommentId, content, null)).toThrowError(
        'INSERT_THREAD_COMMENT_REPLY.USER_ID_NOT_FOUND',
      );
    });

    it('should throw error when parameters userId not meet data type specification', () => {
      // Action & Assert
      expect(() => new InsertThreadCommentReply(threadId, threadCommentId, content, 123)).toThrowError(
        'INSERT_THREAD_COMMENT_REPLY.WRONG_USER_ID_DATA_TYPE',
      );
    });
  });

  it('should create InsertThreadCommentReply entity correctly', () => {
    // Arrange
    const userId = 'user-123';

    // Action
    const insertReply = new InsertThreadCommentReply(threadId, threadCommentId, content, userId);

    // Assert
    expect(insertReply).toBeInstanceOf(InsertThreadCommentReply);
    expect(insertReply.threadId).toEqual(threadId);
    expect(insertReply.threadCommentId).toEqual(threadCommentId);
    expect(insertReply.content).toEqual(content);
    expect(insertReply.userId).toEqual(userId);
  });
});
