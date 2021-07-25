const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO auth VALUES($1) RETURNING token',
      values: [token],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal login');
    }
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM auth  WHERE token = $1',
      values: [token],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Refresh token invalid');
    }
  }

  async deleteRefreshToken(token) {
    await this.verifyRefreshToken(token);
    const query = {
      text: 'DELETE FROM auth WHERE token = $1 RETURNING token',
      values: [token],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal logout');
    }
  }
}
module.exports = AuthenticationsService;
