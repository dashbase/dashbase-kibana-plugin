/**
 *    Copyright 2016 floragunn GmbH

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import {assign} from 'lodash';
import Boom from "boom";


export default function (server, APP_ROOT) {
  const config = server.config();
  const basePath = config.get('server.basePath');
  const cookieConfig = {
    password: "dashbase-asdfasdfasdfasdfasdfasdfasdfasdf",
    cookie: "sig-dashbase",
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
          if (request.url.path.indexOf("/auth/api/v1") === 0 || request.method !== 'get') {
            return reply(Boom.forbidden(error));
          } else {
            // If the session has expired, we may receive ajax requests that can't handle a 302 redirect.
            // In this case, we trigger a 401 and let the interceptor handle the redirect on the client side.
            if (request.headers.accept !== null && request.headers.accept.split(',').indexOf('application/json') > -1) {
              // The redirectTo property in the payload tells the interceptor to handle this error.
              return reply({message: 'Session expired', redirectTo: 'login'}).code(401);
            }

            const nextUrl = encodeURIComponent(request.url.path);
            console.log(nextUrl)
            return reply.redirect(`${basePath}${APP_ROOT}?nextUrl=${nextUrl}`);
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
      console.log(request.auth.credentials.token);
      assign(request.headers, {"DashbaseToken": request.auth.credentials.token});
    }
    return next.continue();
  });
}
