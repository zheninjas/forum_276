import ThreadCommentDetail from '../ThreadCommentDetail.js';
import ThreadCommentReplyDetail from '../ThreadCommentReplyDetail.js';
import ThreadDetail from '../ThreadDetail.js';

describe('ThreadDetail entity', () => {
  const emptyComment = {
    comment_id: null,
    comment_owner_username: null,
    comment_date: null,
    comment_content: null,
    comment_deleted: null,
  };

  const emptyReply = {
    reply_id: null,
    reply_owner_username: null,
    reply_date: null,
    reply_content: null,
    reply_deleted: null,
  };

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

  describe('_normalizePayload function', () => {
    it('should return thread detail with empty comments correctly', () => {
      // Arrange
      const thread = {
        thread_id: 'thread-123',
        thread_title: 'Thread Title',
        thread_body: 'Thread Body',
        thread_date: '2023-02-25T07:00:00.800Z',
        thread_owner_username: 'user-123',
      };

      const payload = [
        {
          ...thread,
          ...emptyComment,
          ...emptyReply,
        },
      ];

      // Action
      const newThread = new ThreadDetail(payload);

      // Assert
      testThread(newThread, {
        id: thread.thread_id,
        title: thread.thread_title,
        body: thread.thread_body,
        date: thread.thread_date,
        username: thread.thread_owner_username,
        comments: [],
      });
    });

    it('should return thread detail with comments and empty replies correctly', () => {
      // Arrange
      const thread = {
        thread_id: 'thread-123',
        thread_title: 'Thread Title',
        thread_body: 'Thread Body',
        thread_date: '2023-02-25T07:00:00.800Z',
        thread_owner_username: 'user-123',
      };

      const comment = {
        comment_id: 'thread-comment-123',
        comment_owner_username: 'user-123',
        comment_date: '2023-02-25T08:00:00.800Z',
        comment_content: 'comment content',
        comment_deleted: false,
      };

      const payload = [
        {
          ...thread,
          ...comment,
          ...emptyReply,
        },
      ];

      // Action
      const newThread = new ThreadDetail(payload);

      // Assert
      testThread(newThread, {
        id: thread.thread_id,
        title: thread.thread_title,
        body: thread.thread_body,
        date: thread.thread_date,
        username: thread.thread_owner_username,
        comments: [
          {
            id: comment.comment_id,
            username: comment.comment_owner_username,
            date: comment.comment_date,
            content: comment.comment_content,
            replies: [],
          },
        ],
      });
    });

    it('should return thread detail with comments and replies correctly', () => {
      // Arrange
      const thread = {
        thread_id: 'thread-123',
        thread_title: 'Thread Title',
        thread_body: 'Thread Body',
        thread_date: '2023-02-25T07:00:00.800Z',
        thread_owner_username: 'user-123',
      };

      const comment = {
        comment_id: 'thread-comment-123',
        comment_owner_username: 'user-123',
        comment_date: '2023-02-25T08:00:00.800Z',
        comment_content: 'comment content',
        comment_deleted: false,
      };

      const reply = {
        reply_id: 'thread-comment-reply-123',
        reply_owner_username: 'user-234',
        reply_date: '2023-02-25T08:10:00.800Z',
        reply_content: 'reply comment',
        reply_deleted: true,
      };

      const payload = [
        {
          ...thread,
          ...comment,
          ...reply,
        },
      ];

      // Action
      const newThread = new ThreadDetail(payload);

      // Assert
      testThread(newThread, {
        id: thread.thread_id,
        title: thread.thread_title,
        body: thread.thread_body,
        date: thread.thread_date,
        username: thread.thread_owner_username,
        comments: [
          {
            id: comment.comment_id,
            username: comment.comment_owner_username,
            date: comment.comment_date,
            content: comment.comment_content,
            replies: [
              {
                id: reply.reply_id,
                username: reply.reply_owner_username,
                date: reply.reply_date,
                content: '**balasan telah dihapus**',
              },
            ],
          },
        ],
      });
    });
  });

  describe('_validatePayload function', () => {
    it('should throw error when payload does not contain needed property', () => {
      // Arrange
      const thread = {
        thread_id: null,
        thread_title: 'Thread Title',
        thread_body: 'Thread Body',
        thread_date: '2023-02-25T07:00:00.800Z',
        thread_owner_username: 'user-123',
      };

      const payload = [
        {
          ...thread,
          ...emptyComment,
          ...emptyReply,
        },
      ];

      // Action & Assert
      expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
      // Arrange
      const thread = {
        thread_id: 123,
        thread_title: 'Thread Title',
        thread_body: 'Thread Body',
        thread_date: '2023-02-25T07:00:00.800Z',
        thread_owner_username: 'user-123',
      };

      const payload = [
        {
          ...thread,
          ...emptyComment,
          ...emptyReply,
        },
      ];

      // Action & Assert
      expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
  });

  it('should create ThreadDetail entity correctly', () => {
    // Arrange
    const thread = {
      thread_id: 'thread-123',
      thread_title: 'Thread Title',
      thread_body: 'Thread Body',
      thread_date: '2023-02-25T07:00:00.800Z',
      thread_owner_username: 'user-123',
    };

    const commentOne = {
      comment_id: 'thread-comment-123',
      comment_owner_username: 'user-123',
      comment_date: '2023-02-25T08:00:00.800Z',
      comment_content: 'comment content one',
      comment_deleted: true,
    };

    const commentTwo = {
      comment_id: 'thread-comment-234',
      comment_owner_username: 'user-123',
      comment_date: '2023-02-25T08:05:00.800Z',
      comment_content: 'comment content two',
      comment_deleted: false,
    };

    const commentTwoReplyOne = {
      reply_id: 'thread-comment-reply-123',
      reply_owner_username: 'user-234',
      reply_date: '2023-02-25T08:10:00.800Z',
      reply_content: 'reply one comment two',
      reply_deleted: true,
    };

    const commentTwoReplyTwo = {
      reply_id: 'thread-comment-reply-234',
      reply_owner_username: 'user-123',
      reply_date: '2023-02-25T08:10:00.800Z',
      reply_content: 'reply two comment one',
      reply_deleted: false,
    };

    const payload = [
      {
        ...thread,
        ...commentOne,
        ...emptyReply,
      },
      {
        ...thread,
        ...commentTwo,
        ...commentTwoReplyOne,
      },
      {
        ...thread,
        ...commentTwo,
        ...commentTwoReplyTwo,
      },
    ];

    // Action
    const newThread = new ThreadDetail(payload);

    // Assert
    testThread(newThread, {
      id: thread.thread_id,
      title: thread.thread_title,
      body: thread.thread_body,
      date: thread.thread_date,
      username: thread.thread_owner_username,
      comments: [
        {
          id: commentOne.comment_id,
          username: commentOne.comment_owner_username,
          date: commentOne.comment_date,
          content: '**komentar telah dihapus**',
          replies: [],
        },
        {
          id: commentTwo.comment_id,
          username: commentTwo.comment_owner_username,
          date: commentTwo.comment_date,
          content: commentTwo.comment_content,
          replies: [
            {
              id: commentTwoReplyOne.reply_id,
              username: commentTwoReplyOne.reply_owner_username,
              date: commentTwoReplyOne.reply_date,
              content: '**balasan telah dihapus**',
            },
            {
              id: commentTwoReplyTwo.reply_id,
              username: commentTwoReplyTwo.reply_owner_username,
              date: commentTwoReplyTwo.reply_date,
              content: commentTwoReplyTwo.reply_content,
            },
          ],
        },
      ],
    });
  });
});
