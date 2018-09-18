import {assign} from 'lodash';
import Boom from "boom";
export  function initAuth(server) {
  const config = server.config();
  const basePath = config.get('server.basePath');
  const cookieConfig = {
    password: "dashbase-asdfasdfasdfasdfasdfasdfasdfasdfasdf",
    cookie: "sig-dashbase-auth",
    isSecure: false,
  };

  server.auth.strategy('dashbase_access_control_cookie', 'cookie', false, cookieConfig);
  server.auth.scheme('dashbase_access_control_scheme', (server, options) => ({
    authenticate: (request, reply) => {
      // if have dashbase token header, check it dirctly
      if (request.headers.dashbasetoken) {
        const credentials = {token: request.headers.dashbasetoken};
        reply.continue({credentials});
        return
      }


      // check cookie
      server.auth.test('dashbase_access_control_cookie', request, (error, credentials) => {
        if (error) {
          if (request.url.path.indexOf("/auth/login") === 0 || request.method !== 'get') {
            return reply(Boom.forbidden(error));
          } else {
            // If the session has expired, we may receive ajax requests that can't handle a 302 redirect.
            // In this case, we trigger a 401 and let the interceptor handle the redirect on the client side.
            if (request.headers.accept !== null && request.headers.accept.split(',').indexOf('application/json') > -1) {
              // The redirectTo property in the payload tells the interceptor to handle this error.
              return reply({message: 'Session expired', redirectTo: 'login'}).code(401);
            }

            const nextUrl = encodeURIComponent(request.url.path);
            return reply.redirect(`${basePath}/auth/login?nextUrl=${nextUrl}`);
          }
        }
        reply.continue({credentials});
      });
    }
  }));
  server.auth.strategy('default', 'dashbase_access_control_scheme', "required");

  // set right dashbase token header in kibana client side.
  // and set elasticsearch.requestHeadersWhitelist:
  // Default: [ 'authorization' ] List of Kibana client-side headers to send to Elasticsearch. To send no client-side headers, set this value to [] (an empty list).
  //

  server.ext('onPostAuth', async function (request, next) {
    if (request.auth && request.auth.isAuthenticated) {
      assign(request.headers, {"DashbaseToken": request.auth.credentials.token});
    }
    return next.continue();
  });
}
