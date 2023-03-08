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

  async addReply(insertThreadCommentReply) {
    const {content, threadCommentId, userId} = insertThreadCommentReply;
    const id = `thread-comment-reply-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO thread_comment_replies VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, threadCommentId, userId],
    };

    const {rows} = await this._pool.query(query);

    return new NewThreadCommentReply(rows[0]);
  }

  async getRepliesByCommentIds(threadCommentIds) {
    const query = {
      text: `
        SELECT
          tcr.id,
          tcr.content,
          tcr.thread_comment_id,
          tcr.is_delete,
          to_char(tcr.date, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as date,
          users.username
        FROM
          thread_comment_replies AS tcr
        JOIN users
          ON tcr.owner = users.id
        WHERE
          tcr.thread_comment_id = ANY($1)
        ORDER BY
          tcr.date
      `,
      values: [threadCommentIds],
    };

    const {rows} = await this._pool.query(query);

    return rows;
  }

  async softDeleteReply(removeThreadCommentReplyId) {
    const {threadCommentReplyId, threadCommentId, userId} = removeThreadCommentReplyId;
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

  async verifyThreadCommentReply(threadCommentReplyId, threadCommentId, threadId) {
    const query = {
      text: `
        SELECT
          t.id as t_id,
          tc.id as tc_id,
          tcr.id as tcr_id
        FROM
          threads AS t
        LEFT JOIN thread_comments AS tc ON t.id = tc.thread_id
          AND tc.id = $2
        LEFT JOIN thread_comment_replies AS tcr ON tc.id = tcr.thread_comment_id
          AND tcr.id = $1
        WHERE
          t.id = $3
      `,
      values: [threadCommentReplyId, threadCommentId, threadId],
    };

    const {rows, rowCount} = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    const {tc_id: tcId, tcr_id: tcrId} = rows[0];

    if (!tcId) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    if (!tcrId) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }
}

export default ThreadCommentReplyRepositoryPostgres;
