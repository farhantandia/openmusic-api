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
    // add FK constraint to playlist_id
  pgm.addConstraint('playlists_songs', 'fk_playlistsongs.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');

  // add FK constraint to song_id
  pgm.addConstraint('playlists_songs', 'fk_playlistsongs.song_id_songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');

  };
  
  exports.down = (pgm) => {
    // drop FK constraint of song_id from playlists
  pgm.dropConstraint('playlists_songs', 'fk_playlistsongs.song_id_songs.id');

  // drop FK constraint of playlist_id from playlists
  pgm.dropConstraint('playlists_songs', 'fk_playlistsongs.playlist_id_playlists.id');

  pgm.dropTable('playlists_songs');
  };
  