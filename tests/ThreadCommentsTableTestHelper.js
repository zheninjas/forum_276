/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js';

const ThreadCommentsTableTestHelper = {
  async addComment({
    id = 'thread-comment-123',
    content = 'comment content ',
    threadId = 'thread-123',
    owner = 'user-123',
    date = '2023-02-25T08:00:00.800Z',
  }) {
    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4, $5)',
      values: [id, content, threadId, owner, date],
    };

    await pool.query(query);
  },

  async findThreadCommentsById(threadId, id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE thread_id = $1 AND id = $2',
      values: [threadId, id],
    };

    const {rows} = await pool.query(query);

    return rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE thread_comments CASCADE');
  },
};

export default ThreadCommentsTableTestHelper;
