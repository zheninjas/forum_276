import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import NewThread from '../../Domains/threads/entities/NewThread.js';
import ThreadCommentDetail from '../../Domains/threads/entities/ThreadCommentDetail.js';
import ThreadCommentReplyDetail from '../../Domains/threads/entities/ThreadCommentReplyDetail.js';
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
          comments.is_delete as comment_deleted,

          replies.id as reply_id,
          reply_user.username as reply_owner_username,
          to_char(replies.date, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as reply_date,
          replies.content as reply_content,
          replies.is_delete as reply_deleted
        FROM
          threads
        JOIN users AS thread_user
          ON threads.owner = thread_user.id
        LEFT JOIN thread_comments AS comments
          ON threads.id = comments.thread_id
        LEFT JOIN users AS comment_user
          ON comments.owner = comment_user.id
        LEFT JOIN thread_comment_replies AS replies
          ON comments.id = replies.thread_comment_id
        LEFT JOIN users AS reply_user
          ON replies.owner = reply_user.id
        WHERE
          threads.id = $1
        GROUP BY
          replies.id, reply_owner_username, comments.id, comment_owner_username, threads.id, thread_owner_username
        ORDER BY
          threads.date, comments.date, replies.date
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

    const groupComment = rows.reduce((comments, row) => {
      const {comment_id: id} = row;

      comments[id] = comments[id] ?? [];
      comments[id].push(row);

      return comments;
    }, {});

    const comments = Object.values(groupComment).flatMap((row) => {
      const {
        comment_id: id,
        comment_owner_username: username,
        comment_date: date,
        comment_content: content,
        comment_deleted: isDelete,
      } = row[0];

      if (id === null) return [];

      return new ThreadCommentDetail({
        id,
        username,
        date,
        content,
        is_delete: isDelete,
        replies: row.flatMap(function({
          reply_id: id,
          reply_owner_username: username,
          reply_date: date,
          reply_content: content,
          reply_deleted: isDelete,
        }) {
          if (id === null) return [];

          return new ThreadCommentReplyDetail({
            id,
            username,
            date,
            content,
            is_delete: isDelete,
          });
        }),
      });
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
