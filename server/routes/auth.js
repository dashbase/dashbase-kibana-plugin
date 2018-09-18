import Boom from 'boom';
import 'isomorphic-fetch';
import { parse } from 'url';
export function initAuthApi(server) {
    const url = server.config().get("dashbase.auth.url");
    const logout = server.getHiddenUiAppById('logout');
    const basePath = server.config().get('server.basePath')
    server.route({
        method: 'GET',
        path: '/auth/logout',
        handler(request, reply) {
            request.cookieAuth.clear();
            return reply.renderAppWithDefaultConfig(logout);
        },
        config: {
            auth: false
        }
    });

    const login = server.getHiddenUiAppById('login');
    server.route({
        method: 'GET',
        path: '/auth/login',
        handler(request, reply) {
            return reply.renderAppWithDefaultConfig(login);
        },
        config: {
            auth: false
        }
    });


    server.route({
        method: 'GET',
        path: '/auth/url',
        handler(request, reply) {
            return reply({ url: url});
        },
        config: {
            auth: false
        }
    });


    server.route({
        method: 'GET',
        path: '/auth/callback',
        async handler(request, reply) {
            const params = request.query;
            const token = params.token;
            let res = await fetch(`${url}/verify?token=` + params.token, {mode: 'no-cors'})
            if (!res.ok) {
                return reply(Boom.unauthorized(`verification failure, token:${token}, msg: ${await res.text()}`));
            }

            let session = {
                token: token
            };
            request.cookieAuth.set(session);
            return reply.redirect(decodeURI(params.nextUrl, basePath))
        },
        config: {
            auth: false
        }
    });

}



function decodeURI(href, basePath = '') {
    href = decodeURIComponent(href)
    const { query, hash } = parse(href, true);
    if (!query.next) {
        return `${basePath}/`;
    }

    const { protocol, hostname, port, pathname } = parse(
        query.next,
        false /* parseQueryString */,
        true /* slashesDenoteHost */
    );

    if (protocol !== null || hostname !== null || port !== null) {
        return `${basePath}/`;
    }

    if (!String(pathname).startsWith(basePath)) {
        return `${basePath}/`;
    }

    return query.next + (hash || '');
}