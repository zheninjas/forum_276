import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js';
import NewThreadCommentReply from '../../Domains/threads/entities/NewThreadCommentReply.js';
import ThreadCommentReplyRepository from '../../Domains/threads/ThreadCommentReplyRepository.js';

class ThreadCommentReplyRepositoryPostgres extends ThreadCommentReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(content, threadCommentId, userId) {
    const id = `thread-comment-reply-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO thread_comment_replies VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, threadCommentId, userId],
    };

    const {rows} = await this._pool.query(query);

    return new NewThreadCommentReply(rows[0]);
  }

  async softDeleteReply(threadCommentReplyId, threadCommentId, userId) {
    const query = {
      text: `
        UPDATE
          thread_comment_replies
        SET
          is_delete = true
        WHERE
          id = $1 AND
          thread_comment_id = $2 AND
          owner = $3 AND
          is_delete = false
        RETURNING
          id
      `,
      values: [threadCommentReplyId, threadCommentId, userId],
    };

    const {rowCount} = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('komentar reply tidak ditemukan');
    }
  }

  async verifyReplyOwner(threadCommentId, userId) {
    const query = {
      text: 'SELECT id FROM thread_comment_replies WHERE id = $1 AND owner = $2',
      values: [threadCommentId, userId],
    };

    const {rowCount} = await this._pool.query(query);

    if (!rowCount) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }
  }

  async verifyReply(threadCommentReplyId, threadCommentId) {
    const query = {
      text: 'SELECT id FROM thread_comment_replies WHERE id = $1 AND thread_comment_id = $2',
      values: [threadCommentReplyId, threadCommentId],
    };

    const {rowCount} = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('komentar reply tidak ditemukan');
    }
  }
}

export default ThreadCommentReplyRepositoryPostgres;
