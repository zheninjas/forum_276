import pool from '../src/Infrastructures/database/postgres/pool.js';

const ThreadCommentLikesTableTestHelper = {
  async addLike({id, threadCommentId, userId}) {
    const query = {
      text: 'INSERT INTO thread_comment_likes VALUES($1, $2, $3)',
      values: [id, threadCommentId, userId],
    };

    await pool.query(query);
  },

  async getLike(id) {
    const query = {
      text: 'SELECT id FROM thread_comment_likes WHERE id = $1',
      values: [id],
    };

    const {rows} = await pool.query(query);

    return rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE thread_comment_likes');
  },
};

export default ThreadCommentLikesTableTestHelper;
