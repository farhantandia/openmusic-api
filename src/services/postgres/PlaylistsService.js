const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ForbiddenError = require('../../exceptions/ForbiddenError');
const { mapDBToSong, mapDBplaylistsToModel } = require('../../utils');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1,$2,$3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async verifyPlaylistOwner(id, owner) {
    const queryOwner = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const resultOwner = await this._pool.query(queryOwner);
    if (!resultOwner.rowCount) {
      throw new NotFoundError('Playlist not found');
    }
    const playlistOwner = resultOwner.rows[0];
    if (playlistOwner.owner !== owner) {
      throw new ForbiddenError('Anda tidak berhak mengakses');
    }
  }
  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
  async verifyCollabPlaylist(playlistId, userId) {
    const queryOwner = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const queryCollaborator = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };
    const resultOwner = await this._pool.query(queryOwner);
    const resultCollab = await this._pool.query(queryCollaborator);
    if (!resultOwner.rowCount) {
      throw new NotFoundError('Playlist not found');
    }
    const playlistOwner = resultOwner.rows[0];
    const playlistCollab = resultCollab.rows[0];
    if (playlistOwner.owner !== userId && (!resultCollab.rowCount || playlistCollab.user_id !== userId)) {
      throw new ForbiddenError('Anda tidak berhak mengakses');
    }
  }

  async getPlaylistByOwner(owner) {
    const query = {
      text: 'SELECT playlists.*,users.username FROM playlists JOIN users ON users.id = playlists.owner WHERE playlists.owner = $1',
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapDBplaylistsToModel);
  }

  async getPlaylistByCollaborator(collaborator) {
    const query = {
      text: 'SELECT collab.playlist_id as id,playlists.name,users.username FROM collaborations AS collab JOIN playlists ON playlists.id = collab.playlist_id JOIN users ON playlists.owner = users.id WHERE collab.user_id = $1',
      values: [collaborator],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapDBplaylistsToModel);
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal mengapus playlist');
    }
  }

  async addSongToPlaylist({ playlistId, songId }) {
    const id = `playlist-song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists_songs VALUES($1,$2,$3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
  }

  async getSongInPlaylist(playlistId) {
    const query = {
      text: 'SELECT playlists_songs.song_id AS id,songs.title,songs.performer FROM playlists_songs JOIN songs ON playlists_songs.song_id = songs.id WHERE playlists_songs.playlist_id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToSong);
  }

  async deleteSongInPlaylist({ playlistId, songId }) {
    const query = {
      text: 'DELETE FROM playlists_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapus lagu dari playlist');
    }
  }
}
module.exports = PlaylistsService;
