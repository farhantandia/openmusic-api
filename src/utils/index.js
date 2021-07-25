const ClientError = require('../exceptions/ClientError');
const mapDBToSong = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

const mapDBplaylistsToModel = ({ 
  id, 
  name, 
  username }) => ({
     id, 
     name, 
     username });

const mapDBToSongDetail = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  inserted_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});
const catchFunction = (error, h) => {
  if (error instanceof ClientError) {
    return h.response({
      status: 'fail',
      message: error.message,
    }).code(error.statusCode);
  }
  return h.response({
    status: 'error',
    message: error.message,
  }).code(500);
};
module.exports = { mapDBToSong,mapDBplaylistsToModel, mapDBToSongDetail,catchFunction };

