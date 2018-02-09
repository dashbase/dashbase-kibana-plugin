import _ from 'lodash';
import { getSort } from 'ui/doc_table/lib/get_sort';
import 'ui/doc_table';
import 'ui/visualize';
import 'ui/notify';
import 'ui/fixed_scroll';
import 'ui/directives/validate_json';
import 'ui/filters/moment';
import 'ui/courier';
import 'ui/index_patterns';
import 'ui/state_management/app_state';
import 'ui/timefilter';
import 'ui/share';
import 'ui/query_bar';
import { VisProvider } from 'ui/vis';
import { BasicResponseHandlerProvider } from 'ui/vis/response_handlers/basic';
import { DocTitleProvider } from 'ui/doc_title';
import { FilterBarQueryFilterProvider } from 'ui/filter_bar/query_filter';
import { AggTypesBucketsIntervalOptionsProvider } from 'ui/agg_types/buckets/_interval_options';
import { stateMonitorFactory } from 'ui/state_management/state_monitor_factory';
import uiRoutes from 'ui/routes';
import { uiModules } from 'ui/modules';
import indexTemplate from './discover.html';
import { StateProvider } from 'ui/state_management/state';
import { migrateLegacyQuery } from 'ui/utils/migrateLegacyQuery';
import { FilterManagerProvider } from 'ui/filter_manager';
import { SavedObjectsClientProvider } from 'ui/saved_objects';
console.log("plugin")
uiRoutes
  .defaults(/discover/, {
    requireDefaultIndex: true
  })
  .when('/discover/:id?', {
    template: indexTemplate,
    reloadOnSearch: false,
    resolve: {
      ip: function (Promise, courier, config, $location, Private) {
        const State = Private(StateProvider);
        const savedObjectsClient = Private(SavedObjectsClientProvider);

        return savedObjectsClient.find({
          type: 'index-pattern',
          fields: ['title'],
          perPage: 10000
        })
          .then(({ savedObjects }) => {
            /**
         *  In making the indexPattern modifiable it was placed in appState. Unfortunately,
         *  the load order of AppState conflicts with the load order of many other things
         *  so in order to get the name of the index we should use, and to switch to the
         *  default if necessary, we parse the appState with a temporary State object and
         *  then destroy it immediatly after we're done
         *
         *  @type {State}
         */
            const state = new State('_a', {});

            const specified = !!state.index;
            const exists = _.findIndex(savedObjects, o => o.id === state.index) > -1;
            const id = exists ? state.index : config.get('defaultIndex');
            state.destroy();

            return Promise.props({
              list: savedObjects,
              loaded: courier.indexPatterns.get(id),
              stateVal: state.index,
              stateValFound: specified && exists
            });
          });
      },
      savedSearch: function (courier, savedSearches, $route) {
        return savedSearches.get($route.current.params.id)
          .catch(courier.redirectWhenMissing({
            'search': '/discover',
            'index-pattern': '/management/kibana/objects/savedSearches/' + $route.current.params.id
          }));
      }
    }
  });
