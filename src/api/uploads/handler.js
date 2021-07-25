const { catchFunction } = require('../../utils');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      const { data } = request.payload;
      this._validator.validateImageHeaders(data.hapi.headers);
      const filename = await this._service.writeFile(data, data.hapi);

      return h.response({
        status: 'success',
        message: 'Gambar berhasil diunggah',
        data: {
          pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
        },
      }).code(201);
    } catch (error) {
      return catchFunction(error, h);
    }
  }
}
module.exports = UploadsHandler;
