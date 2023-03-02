import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import NewThread from '../../Domains/threads/entities/NewThread.js';
import ThreadCommentDetail from '../../Domains/threads/entities/ThreadCommentDetail.js';
import ThreadDetail from '../../Domains/threads/entities/ThreadDetail.js';
import ThreadRepository from '../../Domains/threads/ThreadRepository.js';

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(insertThread, userId) {
    const {title, body} = insertThread;
    const id = `thread-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, userId],
    };

    const {rows} = await this._pool.query(query);

    return new NewThread(rows[0]);
  }

  async getThreadWithComments(threadId) {
    const query = {
      text: `
        SELECT
          threads.id as thread_id,
          threads.title as thread_title,
          threads.body as thread_body,
          to_char(threads.date, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as thread_date,
          thread_user.username as thread_owner_username,
          comments.id as comment_id,
          comment_user.username as comment_owner_username,
          to_char(comments.date, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as comment_date,
          comments.content as comment_content,
          comments.is_delete as comment_deleted
        FROM
          threads
        JOIN users AS thread_user ON threads.owner = thread_user.id
        LEFT JOIN thread_comments AS comments ON threads.id = comments.thread_id
        LEFT JOIN users AS comment_user ON comments.owner = comment_user.id
        WHERE
          threads.id = $1
      `,
      values: [threadId],
    };

    const {rows} = await this._pool.query(query);

    const {
      thread_id: id,
      thread_title: title,
      thread_body: body,
      thread_date: date,
      thread_owner_username: username,
    } = rows[0];

    const comments = rows.flatMap(function({
      comment_id: id,
      comment_owner_username: username,
      comment_date: date,
      comment_content: content,
      comment_deleted: isDelete,
    }) {
      return id !== null ? new ThreadCommentDetail({id, username, date, content, is_delete: isDelete}) : [];
    });

    return new ThreadDetail({
      id,
      title,
      body,
      date,
      username,
      comments,
    });
  }

  async verifyThread(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const {rowCount} = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }
}

export default ThreadRepositoryPostgres;
