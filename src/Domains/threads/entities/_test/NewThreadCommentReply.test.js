import NewThreadCommentReply from '../NewThreadCommentReply.js';

describe('NewThreadCommentReply entity', () => {
  describe('_validatePayload function', () => {
    it('should throw error when payload does not contain needed property', () => {
      // Arrange
      const payload = {
        id: 'thread-comment-reply-123',
        content: 'reply comment content',
      };

      // Action & Assert
      expect(() => new NewThreadCommentReply(payload)).toThrowError(
        'NEW_THREAD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
      );
    });

    it('should throw error when payload not meet data type specification', () => {
      // Arrange
      const payload = {
        id: 'thread-comment-reply-123',
        content: 'reply comment content',
        owner: 123,
      };

      // Action & Assert
      expect(() => new NewThreadCommentReply(payload)).toThrowError(
        'NEW_THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    });
  });

  it('should create NewThreadCommentReply entity correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-comment-reply-123',
      content: 'reply comment content',
      owner: 'user-123',
    };

    // Action
    const newThreadCommentReply = new NewThreadCommentReply(payload);

    // Assert
    expect(newThreadCommentReply).toBeInstanceOf(NewThreadCommentReply);
    expect(newThreadCommentReply.id).toEqual(payload.id);
    expect(newThreadCommentReply.content).toEqual(payload.content);
    expect(newThreadCommentReply.owner).toEqual(payload.owner);
  });
});
