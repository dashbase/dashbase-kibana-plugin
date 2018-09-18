import { initAuth} from './server/auth';
import { initAuthApi } from './server/routes/auth';
import hapiAuthCookie from 'hapi-auth-cookie';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'dashbase',
    uiExports: {
      apps: [{
          id: 'login',
          title: 'Login',
          main: 'plugins/dashbase/views/login',
          hidden: true,
      }, {
          id: 'logout',
          title: 'Logout',
          main: 'plugins/dashbase/views/logout',
          hidden: true
      }],

      chromeNavControls: [
        'plugins/dashbase/chrome/nav'
      ],

    },

    config(Joi) {
      return Joi.object({
          enabled: Joi.boolean().default(true),
          auth: Joi.object({
                enabled: Joi.boolean().default(true),
              url: Joi.string(),
        }),
      }).default();
    },


    init(server, options) {
        server.register(hapiAuthCookie);
        initAuthApi(server);
        initAuth(server);
    }


  });
};
