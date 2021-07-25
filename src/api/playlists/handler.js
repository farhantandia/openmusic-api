const { catchFunction } = require('../../utils');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);

    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getSongInPlaylistHandler = this.getSongInPlaylistHandler.bind(this);
    this.deleteSongInPlaylistHandler = this.deleteSongInPlaylistHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePostPlaylistPayload(request.payload);
      const { name } = request.payload;
      const { id: owner } = request.auth.credentials;
      const id = await this._service.addPlaylist({ name, owner });
      return h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId: id,
        },
      }).code(201);
    } catch (error) {
      return catchFunction(error, h);
    }
  }

  async getPlaylistHandler(request, h) {
    try {
      const { id } = request.auth.credentials;
      const ownerPlaylists = await this._service.getPlaylistByOwner(id);
      const collabPlaylists = await this._service.getPlaylistByCollaborator(id);
      const playlists = ownerPlaylists.concat(collabPlaylists);
      return h.response({
        status: 'success',
        data: {
          playlists,
        },
      }).code(200);
    } catch (error) {
      return catchFunction(error, h);
    }
  }

  async deletePlaylistHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: owner } = request.auth.credentials;
      await this._service.verifyPlaylistOwner(playlistId, owner);
      await this._service.deletePlaylist(playlistId);
      return h.response({
        status: 'success',
        message: 'Playlist berhasil dihapus',
      }).code(200);
    } catch (error) {
      return catchFunction(error, h);
    }
  }

  async postSongToPlaylistHandler(request, h) {
    try {
      this._validator.validatePostSongToPlaylistPayload(request.payload);
      const { playlistId } = request.params;
      const { songId } = request.payload;
      const { id: owner } = request.auth.credentials;
      // await this._service.verifyCollabPlaylist(playlistId, owner);
      await this._service.verifyPlaylistAccess(playlistId, owner);
      await this._service.addSongToPlaylist({ playlistId, songId });
      return h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      }).code(201);
    } catch (error) {
      return catchFunction(error, h);
    }
  }

  async getSongInPlaylistHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: owner } = request.auth.credentials;
      // await this._service.verifyCollabPlaylist(playlistId, owner);
      
      await this._service.verifyPlaylistAccess(playlistId, owner);
      const songs = await this._service.getSongInPlaylist(playlistId);
      return h.response({
        status: 'success',
        data: {
          songs,
        },
      }).code(200);
    } catch (error) {
      return catchFunction(error, h);
    }
  }

  async deleteSongInPlaylistHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { songId } = request.payload;
      const { id: owner } = request.auth.credentials;
      // await this._service.verifyCollabPlaylist(playlistId, owner);
      await this._service.verifyPlaylistAccess(playlistId, owner);
      await this._service.deleteSongInPlaylist({ playlistId, songId });
      return h.response({
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      }).code(200);
    } catch (error) {
      return catchFunction(error, h);
    }
  }
}
module.exports = PlaylistsHandler;
