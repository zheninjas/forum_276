/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js';

const ThreadCommentRepliesTableTestHelper = {
  async addReply({
    id = 'thread-comment-reply-123',
    content = 'comment content reply',
    threadCommentId = 'thread-comment-123',
    owner = 'user-123',
    date = '2023-02-25T08:00:00.800Z',
  }) {
    const query = {
      text: 'INSERT INTO thread_comment_replies VALUES($1, $2, $3, $4, $5)',
      values: [id, content, threadCommentId, owner, date],
    };

    await pool.query(query);
  },

  async findThreadCommentRepliesById(threadCommentId, id) {
    const query = {
      text: 'SELECT * FROM thread_comment_replies WHERE thread_comment_id = $1 AND id = $2',
      values: [threadCommentId, id],
    };

    const {rows} = await pool.query(query);

    return rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE thread_comment_replies CASCADE');
  },
};

export default ThreadCommentRepliesTableTestHelper;
