exports.up = (pgm) => {
  pgm.createTable('thread_comment_replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      unique: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    thread_comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'thread_comments',
      referencesConstraintName: 'fk_thread_thread_comment_reply',
      onDelete: 'cascade',
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      referencesConstraintName: 'fk_user_thread_comment_reply',
      onDelete: 'cascade',
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('thread_comment_replies');
};
