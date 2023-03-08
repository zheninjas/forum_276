import InsertThreadCommentReply from '../InsertThreadCommentReply.js';

describe('InsertThreadCommentReply entity', () => {
  it('should throw error when parameters does not contain threadId or commentId', () => {
    // Arrange
    const threadId = 'thread-123';
    const threadCommentId = 'thread-123';

    // Action & Assert
    expect(() => new InsertThreadCommentReply(threadId, null)).toThrowError(
      'INSERT_THREAD_COMMENT.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY',
    );
    expect(() => new InsertThreadCommentReply(null, threadCommentId)).toThrowError(
      'INSERT_THREAD_COMMENT.PARAMS_NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when parameters threadId or commentId not meet data type specification', () => {
    // Arrange
    const threadId = 'thread-123';
    const threadCommentId = 'thread-123';

    // Action & Assert
    expect(() => new InsertThreadCommentReply(threadId, 123)).toThrowError(
      'INSERT_THREAD_COMMENT.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
    expect(() => new InsertThreadCommentReply(123, threadCommentId)).toThrowError(
      'INSERT_THREAD_COMMENT.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should throw error when parameters does not contain content', () => {
    // Arrange
    const threadId = 'thread-123';
    const threadCommentId = 'thread-123';

    // Action & Assert
    expect(() => new InsertThreadCommentReply(threadId, threadCommentId, null)).toThrowError(
      'INSERT_THREAD_COMMENT.PAYLOAD_NOT_CONTAIN_CONTENT',
    );
  });

  it('should throw error when parameters content not meet data type specification', () => {
    // Arrange
    const threadId = 'thread-123';
    const threadCommentId = 'thread-123';

    // Action & Assert
    expect(() => new InsertThreadCommentReply(threadId, threadCommentId, 123)).toThrowError(
      'INSERT_THREAD_COMMENT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should throw error when parameters does not contain userId', () => {
    // Arrange
    const threadId = 'thread-123';
    const threadCommentId = 'thread-123';
    const content = 'comment content';

    // Action & Assert
    expect(() => new InsertThreadCommentReply(threadId, threadCommentId, content, null)).toThrowError(
      'INSERT_THREAD_COMMENT.USER_ID_NOT_FOUND',
    );
  });

  it('should throw error when parameters userId not meet data type specification', () => {
    // Arrange
    const threadId = 'thread-123';
    const threadCommentId = 'thread-123';
    const content = 'comment content';

    // Action & Assert
    expect(() => new InsertThreadCommentReply(threadId, threadCommentId, content, 123)).toThrowError(
      'INSERT_THREAD_COMMENT.WRONG_USER_ID_DATA_TYPE',
    );
  });

  it('should create InsertThreadCommentReply entity correctly', () => {
    // Arrange
    const threadId = 'thread-123';
    const threadCommentId = 'thread-123';
    const content = 'comment content';
    const userId = 'user-123';

    // Action
    const insertThread = new InsertThreadCommentReply(threadId, threadCommentId, content, userId);

    // Assert
    expect(insertThread).toBeInstanceOf(InsertThreadCommentReply);
    expect(insertThread.threadId).toEqual(threadId);
    expect(insertThread.threadCommentId).toEqual(threadCommentId);
    expect(insertThread.content).toEqual(content);
    expect(insertThread.userId).toEqual(userId);
  });
});
