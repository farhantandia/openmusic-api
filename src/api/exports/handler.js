const { catchFunction } = require('../../utils');

class ExportsHandler {
  constructor(producerService, playlistService, validator) {
    this._producerService = producerService;
    this._playlistService = playlistService;
    this._validator = validator;

    this.postExportsSongHandler = this.postExportsSongHandler.bind(this);
  }

  async postExportsSongHandler(request, h) {
    try {
      const userId = request.auth.credentials.id;
      const { playlistId } = request.params;
      await this._playlistService.verifyPlaylistOwner(playlistId, userId);
      await this._playlistService.verifyCollabPlaylist(playlistId, userId);
      this._validator.validateExportSongPayload(request.payload);
      const message = {
        playlistId,
        targetEmail: request.payload.targetEmail,
      };
      await this._producerService.sendMessage('export:music', JSON.stringify(message));
      return h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      }).code(201);
    } catch (error) {
      return catchFunction(error, h);
    }
  }
}
module.exports = ExportsHandler;
