const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaboration',
  version: '1.0.0',
  register: async (server, { collabService, playlistService, validator }) => {
    const collabHandler = new CollaborationsHandler(collabService, playlistService, validator);
    server.route(routes(collabHandler));
  },
};
