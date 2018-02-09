export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'dashbase',
    uiExports: {


      hacks: [
        'plugins/dashbase/query_bar/query_bar',
        'plugins/dashbase/discover/discover'],

    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    }
    ,


  })
};
