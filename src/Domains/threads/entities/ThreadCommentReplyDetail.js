class ThreadCommentReplyDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    ({
      id: this.id,
      username: this.username,
      date: this.date,
      content: this.content,
      is_delete: this.isDelete,
    } = payload);
  }

  _verifyPayload(payload) {
    const {id, username, date, content, is_delete: isDelete} = payload;

    if (!id || !username || !date || !content || isDelete === undefined) {
      throw new Error('THREAD_COMMENT_REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'string' ||
      typeof content !== 'string' ||
      typeof isDelete !== 'boolean'
    ) {
      throw new Error('THREAD_COMMENT_REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default ThreadCommentReplyDetail;
