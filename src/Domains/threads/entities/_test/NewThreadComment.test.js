import NewThreadComment from '../NewThreadComment.js';

describe('NewThreadComment entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-comment-123',
      content: 'comment content',
    };

    // Action & Assert
    expect(() => new NewThreadComment(payload)).toThrowError('NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-comment-123',
      content: 'comment content',
      owner: 123,
    };

    // Action & Assert
    expect(() => new NewThreadComment(payload)).toThrowError('NEW_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThreadComment entity correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-comment-123',
      content: 'comment content',
      owner: 'user-123',
    };

    // Action
    const newThread = new NewThreadComment(payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewThreadComment);
    expect(newThread.id).toEqual(payload.id);
    expect(newThread.content).toEqual(payload.content);
    expect(newThread.owner).toEqual(payload.owner);
  });
});
