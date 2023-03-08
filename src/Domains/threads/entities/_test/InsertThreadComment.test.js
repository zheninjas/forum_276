import InsertThreadComment from '../InsertThreadComment.js';

describe('InsertThreadComment entity', () => {
  const threadId = 'thread-123';
  const content = 'comment content';

  describe('validate data function', () => {
    it('should throw error when parameters does not contain threadId', () => {
      // Action & Assert
      expect(() => new InsertThreadComment(null)).toThrowError('INSERT_THREAD_COMMENT.PARAMS_NOT_CONTAIN_THREAD_ID');
    });

    it('should throw error when parameters threadId not meet data type specification', () => {
      // Action & Assert
      expect(() => new InsertThreadComment(123)).toThrowError(
        'INSERT_THREAD_COMMENT.PARAMS_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    });

    it('should throw error when parameters does not contain content', () => {
      // Action & Assert
      expect(() => new InsertThreadComment(threadId, null)).toThrowError(
        'INSERT_THREAD_COMMENT.PAYLOAD_NOT_CONTAIN_CONTENT',
      );
    });

    it('should throw error when parameters content not meet data type specification', () => {
      // Action & Assert
      expect(() => new InsertThreadComment(threadId, 123)).toThrowError(
        'INSERT_THREAD_COMMENT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    });

    it('should throw error when parameters does not contain userId', () => {
      // Action & Assert
      expect(() => new InsertThreadComment(threadId, content, null)).toThrowError(
        'INSERT_THREAD_COMMENT.USER_ID_NOT_FOUND',
      );
    });

    it('should throw error when parameters userId not meet data type specification', () => {
      // Action & Assert
      expect(() => new InsertThreadComment(threadId, content, 123)).toThrowError(
        'INSERT_THREAD_COMMENT.WRONG_USER_ID_DATA_TYPE',
      );
    });
  });

  it('should create InsertThreadComment entity correctly', () => {
    // Arrange
    const userId = 'user-123';

    // Action
    const insertThread = new InsertThreadComment(threadId, content, userId);

    // Assert
    expect(insertThread).toBeInstanceOf(InsertThreadComment);
    expect(insertThread.threadId).toEqual(threadId);
    expect(insertThread.content).toEqual(content);
    expect(insertThread.userId).toEqual(userId);
  });
});
