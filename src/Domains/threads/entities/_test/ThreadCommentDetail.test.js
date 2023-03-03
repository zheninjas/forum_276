import ThreadCommentDetail from '../ThreadCommentDetail.js';

describe('ThreadCommentDetail entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-comment-123',
      username: 'monne',
      content: 'comment content',
    };

    // Action & Assert
    expect(() => new ThreadCommentDetail(payload)).toThrowError('THREAD_COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-comment-123',
      username: 'monne',
      content: 'comment content',
      date: 1233145235,
      is_delete: false,
      replies: [],
    };

    // Action & Assert
    expect(() => new ThreadCommentDetail(payload)).toThrowError(
      'THREAD_COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create ThreadCommentDetail entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-comment-123',
      username: 'monne',
      content: 'comment content',
      date: '2023-02-26T07:43:24.859Z',
      is_delete: false,
      replies: [],
    };

    // Action
    const newThreadComment = new ThreadCommentDetail(payload);

    // Assert
    expect(newThreadComment).toBeInstanceOf(ThreadCommentDetail);
    expect(newThreadComment.id).toEqual(payload.id);
    expect(newThreadComment.username).toEqual(payload.username);
    expect(newThreadComment.content).toEqual(payload.content);
    expect(newThreadComment.date).toEqual(payload.date);
    expect(newThreadComment.isDelete).toEqual(payload.is_delete);
    expect(newThreadComment.replies).toEqual(payload.replies);
  });
});
