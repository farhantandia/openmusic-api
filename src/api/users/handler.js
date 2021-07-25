const { catchFunction } = require('../../utils');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      this._validator.validateUserPayload(request.payload);
      const { username, password, fullname } = request.payload;
      const id = await this._service.addUser({ username, password, fullname });
      return h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId: id,
        },
      }).code(201);
    } catch (error) {
      return catchFunction(error, h);
    }
  }
}

module.exports = UsersHandler;
