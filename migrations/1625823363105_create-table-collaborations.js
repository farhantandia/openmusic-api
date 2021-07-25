exports.up = (pgm) => {
    pgm.createTable('collaborations', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      playlist_id: {
        type: 'VARCHAR(50)',
        notNull: true,
        references: '"playlists"',
      },
      user_id: {
        type: 'VARCHAR(50)',
        notNull: true,
        references: '"users"',
      },
    });
    pgm.createIndex('collaborations', 'playlist_id');
    pgm.createIndex('collaborations', 'user_id');
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('collaborations');
    pgm.dropIndex('collaborations', 'playlist_id');
    pgm.dropIndex('collaborations', 'user_id');
  };
  