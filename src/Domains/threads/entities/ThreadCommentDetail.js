class ThreadCommentDetail {
  constructor(payload) {
    this._validatePayload(payload);

    ({id: this.id, username: this.username, date: this.date, replies: this.replies} = payload);

    const {content, is_delete: isDelete} = payload;

    this.content = isDelete ? '**komentar telah dihapus**' : content;
  }

  _validatePayload(payload) {
    const {id, username, date, content, is_delete: isDelete, replies} = payload;

    if (!id || !username || !date || !content || isDelete === undefined || !replies) {
      throw new Error('THREAD_COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'string' ||
      typeof content !== 'string' ||
      typeof isDelete !== 'boolean' ||
      !(replies instanceof Array)
    ) {
      throw new Error('THREAD_COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default ThreadCommentDetail;
