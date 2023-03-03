import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';
import ClientError from '../../Commons/exceptions/ClientError.js';
import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator.js';
import authentications from '../../Interfaces/http/api/authentications/index.js';
import users from '../../Interfaces/http/api/users/index.js';
import threads from '../../Interfaces/http/api/threads/index.js';

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('forum_jwt', 'jwt', {
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

  await server.register([
    {
      plugin: users,
      options: {container},
    },
    {
      plugin: authentications,
      options: {container},
    },
    {
      plugin: threads,
      options: {container},
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const {response} = request;

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response);

      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message,
        });

        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      if (!translatedError.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });

      console.log(response);

      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  return server;
};

export default createServer;
