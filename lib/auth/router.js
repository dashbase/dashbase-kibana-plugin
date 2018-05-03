import Boom from 'boom';
import Joi from 'joi';
import {isEmpty} from 'lodash';

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }

}

export default function (server, APP_ROOT, API_ROOT) {
  const loginApp = server.getHiddenUiAppById('dashbase-auth-login');

  server.route({
    method: 'GET',
    path: `${APP_ROOT}`,
    handler(request, reply) {
      return reply.renderAppWithDefaultConfig(loginApp);
    },
    config: {
      auth: false
    }
  });


  server.route({
    method: 'POST',
    path: `${API_ROOT}/login`,
    handler: {
      async: async (request, reply) => {
        try {
          // TODO
          // to call dashbase auth to check dashbase token validity
          if (request.payload.token !== "yourDashbaseToken") {
            throw new AuthError("error")
          }

          let session = {
            token: "yourDashbaseToken"
          };
          // session.expiryTime = Date.now() + sessionTTL;
          request.auth.session.set(session);
          return reply({
            username: "peter",
          });
        } catch (error) {
          if (error instanceof AuthError) {
            return reply(Boom.unauthorized(error.message));
          } else {
            return reply(Boom.badImplementation(error.message));
          }
        }
      }
    },
    config: {
      validate: {
        payload: {
          token: Joi.string().required(),
        }
      },
      auth: false
    }
  });

  server.route({
    method: 'POST',
    path: `${API_ROOT}/logout`,
    handler: (request, reply) => {
      request.auth.session.clear();
    },
    config: {
      auth: false
    }
  });

};
