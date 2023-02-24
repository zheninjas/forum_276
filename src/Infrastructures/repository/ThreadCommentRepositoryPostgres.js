import NewThreadComment from '../../Domains/threads/entities/NewThreadComment.js';
import ThreadCommentRepository from '../../Domains/threads/ThreadCommentRepository.js';

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(content, threadId, userId) {
    const id = `thread-comment-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, threadId, userId],
    };

    const {rows} = await this._pool.query(query);

    return new NewThreadComment(rows[0]);
  }
}

export default ThreadCommentRepositoryPostgres;
