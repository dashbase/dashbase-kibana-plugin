export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'dashbase',
    uiExports: {
      hacks: [
        // 'plugins/dashbase/query_bar/query_bar',
        // 'plugins/dashbase/discover/discover',
      ],
      apps: [
        {
          id: 'dashbase-auth-login',
          title: 'Login',
          main: 'plugins/dashbase/apps/login/login',
          hidden: true,
          auth: false
        }]

    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    }
    ,
    init(server, options) {
      const APP_ROOT = "/auth/login";
      const API_ROOT = "/auth/api/v1";
      server.register([require('hapi-async-handler'), require('hapi-auth-cookie'),]);
      require('./lib/auth/auth')(server, APP_ROOT);
      require('./lib/auth/router')(server, APP_ROOT, API_ROOT);
    }
  })
};
