exports.up = (pgm) => {
  pgm.createTable('thread_comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      unique: true,
    },
    thread_comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'thread_comments',
      referencesConstraintName: 'fk_thread_comment_thread_comment_likes',
      onDelete: 'cascade',
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      referencesConstraintName: 'fk_user_thread_comment_likes',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint(
    'thread_comment_likes',
    'unique_user_id_and_thread_comment_id',
    'UNIQUE(user_id, thread_comment_id)',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('thread_comment_likes');
};
