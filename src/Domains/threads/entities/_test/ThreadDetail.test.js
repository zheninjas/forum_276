import ThreadCommentDetail from '../ThreadCommentDetail.js';
import ThreadCommentReplyDetail from '../ThreadCommentReplyDetail.js';
import ThreadDetail from '../ThreadDetail.js';

describe('ThreadDetail entity', () => {
  const testThread = (threadDetail, threadPayload) => {
    expect(threadDetail).toBeInstanceOf(ThreadDetail);
    expect(threadDetail.id).toEqual(threadPayload.id);
    expect(threadDetail.title).toEqual(threadPayload.title);
    expect(threadDetail.body).toEqual(threadPayload.body);
    expect(threadDetail.date).toEqual(threadPayload.date);
    expect(threadDetail.username).toEqual(threadPayload.username);

    testComments(threadDetail.comments, threadPayload.comments);
  };

  const testComments = (threadCommentDetails, threadCommentPayload) => {
    expect(threadCommentDetails).toBeInstanceOf(Array);
    expect(threadCommentDetails).toHaveLength(threadCommentPayload.length);

    threadCommentDetails.forEach((comment, index) => {
      const commentPayload = threadCommentPayload[index];

      expect(comment).toBeInstanceOf(ThreadCommentDetail);
      expect(comment.id).toEqual(commentPayload.id);
      expect(comment.username).toEqual(commentPayload.username);
      expect(comment.date).toEqual(commentPayload.date);
      expect(comment.content).toEqual(commentPayload.content);

      testReplies(comment.replies, commentPayload.replies);
    });
  };

  const testReplies = (threadCommentReplyDetail, threadCommentReplyPayload) => {
    expect(threadCommentReplyDetail).toBeInstanceOf(Array);
    expect(threadCommentReplyDetail).toHaveLength(threadCommentReplyPayload.length);

    threadCommentReplyDetail.forEach((reply, index) => {
      const replyPayload = threadCommentReplyPayload[index];

      expect(reply).toBeInstanceOf(ThreadCommentReplyDetail);
      expect(reply.id).toEqual(replyPayload.id);
      expect(reply.username).toEqual(replyPayload.username);
      expect(reply.date).toEqual(replyPayload.date);
      expect(reply.content).toEqual(replyPayload.content);
    });
  };

  describe('validate payload', () => {
    it('should throw error when payload does not contain needed property', () => {
      // Arrange
      const thread = {
        id: null,
        title: 'Thread Title',
        body: 'Thread Body',
        date: '2023-02-25T07:00:00.800Z',
        username: 'user-123',
        comments: [],
      };

      // Action & Assert
      expect(() => new ThreadDetail(thread)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
      // Arrange
      const thread = {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread Body',
        date: '2023-02-25T07:00:00.800Z',
        username: 'user-123',
        comments: 123,
      };

      // Action & Assert
      expect(() => new ThreadDetail(thread)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
  });

  it('should create ThreadDetail entity correctly', () => {
    // Arrange
    const thread = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2023-02-25T07:00:00.800Z',
      username: 'user-123',
    };

    const commentOne = {
      id: 'thread-comment-123',
      username: 'user-123',
      date: '2023-02-25T08:00:00.800Z',
      content: 'comment content one',
      is_delete: true,
    };

    const commentTwo = {
      id: 'thread-comment-234',
      username: 'user-123',
      date: '2023-02-25T08:05:00.800Z',
      content: 'comment content two',
      is_delete: false,
    };

    const commentTwoReplyOne = {
      id: 'thread-comment-reply-123',
      username: 'user-234',
      date: '2023-02-25T08:10:00.800Z',
      content: 'reply one comment two',
      thread_comment_id: commentTwo.id,
      is_delete: true,
    };

    const commentTwoReplyTwo = {
      id: 'thread-comment-reply-234',
      username: 'user-123',
      date: '2023-02-25T08:10:00.800Z',
      content: 'reply two comment two',
      thread_comment_id: commentTwo.id,
      is_delete: false,
    };

    // Action
    const newThread = new ThreadDetail({
      ...thread,
      comments: [
        new ThreadCommentDetail({
          ...commentOne,
          replies: [],
        }),
        new ThreadCommentDetail({
          ...commentTwo,
          replies: [new ThreadCommentReplyDetail(commentTwoReplyOne), new ThreadCommentReplyDetail(commentTwoReplyTwo)],
        }),
      ],
    });

    // Assert
    testThread(newThread, {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: [
        {
          id: commentOne.id,
          username: commentOne.username,
          date: commentOne.date,
          content: '**komentar telah dihapus**',
          replies: [],
        },
        {
          id: commentTwo.id,
          username: commentTwo.username,
          date: commentTwo.date,
          content: commentTwo.content,
          replies: [
            {
              id: commentTwoReplyOne.id,
              username: commentTwoReplyOne.username,
              date: commentTwoReplyOne.date,
              content: '**balasan telah dihapus**',
            },
            {
              id: commentTwoReplyTwo.id,
              username: commentTwoReplyTwo.username,
              date: commentTwoReplyTwo.date,
              content: commentTwoReplyTwo.content,
            },
          ],
        },
      ],
    });
  });
});
