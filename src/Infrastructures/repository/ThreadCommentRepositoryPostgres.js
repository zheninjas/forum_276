import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import NewThreadComment from '../../Domains/threads/entities/NewThreadComment.js';
import ThreadCommentRepository from '../../Domains/threads/ThreadCommentRepository.js';

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(insertThreadComment) {
    const {threadId, content, userId} = insertThreadComment;
    const id = `thread-comment-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, threadId, userId],
    };

    const {rows} = await this._pool.query(query);

    return new NewThreadComment(rows[0]);
  }

  async getComments(threadId) {
    const query = {
      text: `
        SELECT
          tc.id,
          tc.content,
          tc.is_delete,
          to_char(tc.date, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as date,
          users.username
        FROM
          thread_comments AS tc
        JOIN users
          ON tc.owner = users.id
        WHERE
          tc.thread_id = $1
        ORDER BY
          tc.date
      `,
      values: [threadId],
    };

    const {rows} = await this._pool.query(query);

    return rows;
  }

  async softDeleteComment(removeThreadComment) {
    const {threadCommentId, threadId, userId} = removeThreadComment;
    const query = {
      text: `
        UPDATE
          thread_comments
        SET
          is_delete = true
        WHERE
          id = $1 AND
          thread_id = $2 AND
          owner = $3 AND
          is_delete = false
        RETURNING
          id
      `,
      values: [threadCommentId, threadId, userId],
    };

    const {rowCount} = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async verifyCommentOwner(threadCommentId, userId) {
    const query = {
      text: 'SELECT id FROM thread_comments WHERE id = $1 AND owner = $2',
      values: [threadCommentId, userId],
    };

    const {rowCount} = await this._pool.query(query);

    if (!rowCount) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }
  }

  async verifyComment(threadCommentId, threadId) {
    const query = {
      text: 'SELECT id FROM thread_comments WHERE id = $1 AND thread_id = $2',
      values: [threadCommentId, threadId],
    };

    const {rowCount} = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }
}

export default ThreadCommentRepositoryPostgres;
