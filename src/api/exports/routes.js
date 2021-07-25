const routes = (handler) => [
  {
    method: 'POST',
    path: '/exports/playlists/{playlistId}',
    handler: handler.postExportsSongHandler,
    options: {
      auth: 'songs_jwt',
    },
  },
];
module.exports = routes;
