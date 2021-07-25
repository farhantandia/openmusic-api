require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs/index');

const user = require('./api/users');
const UserService = require('./services/postgres/UsersService');
const UserValidator = require('./validator/users');

const auth = require('./api/authentications');
const AuthService = require('./services/postgres/AuthenticationsService');
const AuthValidator = require('./validator/authentications');
const tokenManager = require('./tokenize/TokenManager');

const playlist = require('./api/playlists');
const PlaylistService = require('./services/postgres/PlaylistsService');
const PlaylistValidator = require('./validator/playlists');

const collaboration = require('./api/collaboration');
const CollaborationService = require('./services/postgres/CollaborationsService');
const CollaborationValidator = require('./validator/collaboration');

const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

const CacheService = require('./services/redis/CacheService');

const init = async () => {
  const cacheService = new CacheService();
  const songsService = new SongsService(cacheService);
  const userService = new UserService();
  const authService = new AuthService();
  const collaborationService = new CollaborationService();
  const playlistService = new PlaylistService(cacheService);
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));


  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('songs_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([{
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },
    
  },{
    plugin: user,
    options: {
      service: userService,
      validator: UserValidator,
    },
  },{
    plugin: auth,
    options: {
      authService,
      userService,
      tokenManager,
      validator: AuthValidator,
    },
  },{
    plugin: playlist,
    options: {
      service: playlistService,
      validator: PlaylistValidator,
    },
  }, 
  {
    plugin: collaboration,
    options: {
      collabService: collaborationService,
      playlistService,
      validator: CollaborationValidator,
    }, 

  }, {
    plugin: _exports,
    options: {
      producerService: ProducerService,
      playlistService,
      validator: ExportsValidator,
    },
  },
  {
    plugin: uploads,
    options: {
      service: storageService,
      validator: UploadsValidator,
    },
  }]).catch((err) => console.log(err));

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
init();
