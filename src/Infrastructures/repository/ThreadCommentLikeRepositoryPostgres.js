import ThreadCommentLikeRepository from '../../Domains/threads/ThreadCommentLikeRepository.js';

class ThreadCommentLikeRepositoryPostgres extends ThreadCommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getLikeId(threadCommentId, userId) {
    const query = {
      text: 'SELECT id FROM thread_comment_likes WHERE thread_comment_id = $1 AND user_id = $2',
      values: [threadCommentId, userId],
    };

    const {rows, rowCount} = await this._pool.query(query);

    return rowCount > 0 ? rows[0].id : null;
  }

  async getLikesByCommentIds(threadCommentIds) {
    const query = {
      text: `
        SELECT
          COUNT(tcl.thread_comment_id)::int as like_count,
          tcl.thread_comment_id
        FROM
          thread_comment_likes AS tcl
        WHERE
          tcl.thread_comment_id = ANY($1)
        GROUP BY
          tcl.thread_comment_id
      `,
      values: [threadCommentIds],
    };

    const {rows} = await this._pool.query(query);

    return rows;
  }

  async insertLike(toggleThreadCommentLike) {
    const {threadCommentId, userId} = toggleThreadCommentLike;
    const id = `thread-comment-like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO thread_comment_likes VALUES($1, $2, $3)',
      values: [id, threadCommentId, userId],
    };

    await this._pool.query(query);
  }

  async removeLike(threadCommentLikeId) {
    const query = {
      text: 'DELETE FROM thread_comment_likes WHERE id = $1',
      values: [threadCommentLikeId],
    };

    await this._pool.query(query);
  }
}

export default ThreadCommentLikeRepositoryPostgres;
