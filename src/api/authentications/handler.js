const { catchFunction } = require('../../utils');

class AuthenticationsHandler {
  constructor(authService, userService, tokenManager, validator) {
    this._authService = authService;
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._validator = validator;
    this.postAuthHandler = this.postAuthHandler.bind(this);
    this.putAuthHandler = this.putAuthHandler.bind(this);
    this.deleteAuthHandler = this.deleteAuthHandler.bind(this);
  }

  async postAuthHandler(request, h) {
    try {
      this._validator.validatePostAuthPayload(request.payload);
      const { username, password } = request.payload;
      const id = await this._userService.verifyUserCredentials(username, password);
      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });
      await this._authService.addRefreshToken(refreshToken);
      return h.response({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken,
        },
      }).code(201);
    } catch (error) {
      return catchFunction(error, h);
    }
  }

  async putAuthHandler(request, h) {
    try {
      this._validator.validatePutAuthPayload(request.payload);
      const { refreshToken } = request.payload;
      await this._authService.verifyRefreshToken(refreshToken);
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
      const accessToken = this._tokenManager.generateAccessToken({ id });
      return h.response({
        status: 'success',
        message: 'Authentication berhasil diperbarui',
        data: {
          accessToken,
        },
      }).code(200);
    } catch (error) {
      return catchFunction(error, h);
    }
  }

  async deleteAuthHandler(request, h) {
    try {
      this._validator.validateDeleteAuthPayload(request.payload);
      const { refreshToken } = request.payload;
      await this._authService.verifyRefreshToken(refreshToken);
      await this._authService.deleteRefreshToken(refreshToken);
      return h.response({
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      }).code(200);
    } catch (error) {
      return catchFunction(error, h);
    }
  }
}

module.exports = AuthenticationsHandler;
