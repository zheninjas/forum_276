import ThreadCommentDetail from '../entities/ThreadCommentDetail.js';
import ThreadCommentReplyDetail from '../entities/ThreadCommentReplyDetail.js';

class ThreadDetail {
  constructor(rawPayload) {
    const normalizedPayload = this._normalizePayload(rawPayload);

    this._validatePayload(normalizedPayload);

    ({
      id: this.id,
      title: this.title,
      body: this.body,
      date: this.date,
      username: this.username,
      comments: this.comments,
    } = normalizedPayload);
  }

  _normalizePayload(rawPayload) {
    const {
      thread_id: id,
      thread_title: title,
      thread_body: body,
      thread_date: date,
      thread_owner_username: username,
    } = rawPayload[0];

    const groupComment = rawPayload.reduce((comments, row) => {
      const {comment_id: id} = row;

      comments[id] = comments[id] ?? [];
      comments[id].push(row);

      return comments;
    }, {});

    const comments = Object.values(groupComment).flatMap(function(row) {
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

    return {
      id,
      title,
      body,
      date,
      username,
      comments,
    };
  }

  _validatePayload(payload) {
    const {id, title, body, date, username, comments} = payload;

    if (!id || !title || !body || !date || !username || !comments) {
      throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof date !== 'string' ||
      typeof username !== 'string' ||
      !(comments instanceof Array)
    ) {
      throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default ThreadDetail;
