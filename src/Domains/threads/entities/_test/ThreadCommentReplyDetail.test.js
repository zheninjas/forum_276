import ThreadCommentReplyDetail from '../ThreadCommentReplyDetail.js';

describe('ThreadCommentReplyDetail entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-comment-reply-123',
      username: 'monne',
      content: 'reply comment content',
    };

    // Action & Assert
    expect(() => new ThreadCommentReplyDetail(payload)).toThrowError(
      'THREAD_COMMENT_REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-comment-reply-123',
      username: 'monne',
      content: 'reply comment content',
      date: 1233145235,
      is_delete: false,
    };

    // Action & Assert
    expect(() => new ThreadCommentReplyDetail(payload)).toThrowError(
      'THREAD_COMMENT_REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create ThreadCommentReplyDetail entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-comment-reply-123',
      username: 'monne',
      content: 'reply comment content',
      date: '2023-02-26T07:43:24.859Z',
      is_delete: false,
    };

    // Action
    const newThreadCommentReply = new ThreadCommentReplyDetail(payload);

    // Assert
    expect(newThreadCommentReply).toBeInstanceOf(ThreadCommentReplyDetail);
    expect(newThreadCommentReply.id).toEqual(payload.id);
    expect(newThreadCommentReply.username).toEqual(payload.username);
    expect(newThreadCommentReply.content).toEqual(payload.content);
    expect(newThreadCommentReply.date).toEqual(payload.date);
    expect(newThreadCommentReply.isDelete).toEqual(payload.is_delete);
  });
});
