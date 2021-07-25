exports.up = (pgm) => {
    pgm.createTable('playlists_songs', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      playlist_id: {
        type: 'VARCHAR(50)',
        notNull: true,
        references: '"playlists"',
      },
      song_id: {
        type: 'VARCHAR(50)',
        notNull: true,
        references: '"songs"',
      },
    });
    pgm.createIndex('playlists_songs', 'playlist_id');
    pgm.createIndex('playlists_songs', 'song_id');
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('playlists_songs');
    pgm.dropIndex('playlists_songs', 'playlist_id');
    pgm.dropIndex('playlists_songs', 'song_id');
  };
  