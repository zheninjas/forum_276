import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import NewThread from '../../Domains/threads/entities/NewThread.js';
import ThreadRepository from '../../Domains/threads/ThreadRepository.js';

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(insertThread) {
    const {title, body, userId} = insertThread;
    const id = `thread-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, userId],
    };

    const {rows} = await this._pool.query(query);

    return new NewThread(rows[0]);
  }

  async getThread(threadId) {
    const query = {
      text: `
        SELECT
          threads.id as id,
          threads.title as title,
          threads.body as body,
          to_char(threads.date, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as date,
          users.username as username
        FROM
          threads
        JOIN users
          ON threads.owner = users.id
        WHERE
          threads.id = $1
        ORDER BY
          threads.date
      `,
      values: [threadId],
    };

    const {rows} = await this._pool.query(query);

    return rows[0];
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
