import { uiModules } from 'ui/modules';
import { callAfterBindingsWorkaround } from 'ui/compat';
import template from './query_bar.html';
import { queryLanguages } from '../../lib/queryLanguages';
import 'ui/directives/documentation_href';

const module = uiModules.get('kibana');
module.config(['$provide', Decorate]);

function Decorate($provide) {
  $provide.decorator('queryBarDirective', function($delegate) {
    var directive = $delegate[0];

    directive.template = template;

    return $delegate;
  });
}

// module.directive('queryBar', function () {
//
//   return {
//     restrict: 'E',
//     template: template,
//     scope: {
//       query: '=',
//       appName: '=?',
//       onSubmit: '&',
//       disableAutoFocus: '='
//     },
//     controllerAs: 'queryBar',
//     bindToController: true,
//     controller: callAfterBindingsWorkaround(function ($scope, config) {
//       this.appName = this.appName || 'global';
//       this.availableQueryLanguages = queryLanguages;
//       this.showLanguageSwitcher = config.get('search:queryLanguage:switcher:enable');
//       this.typeaheadKey = () => `${this.appName}-${this.query.language}`;
//
//       this.submit = () => {
//         this.onSubmit({ $query: this.localQuery });
//       };
//
//       this.selectLanguage = () => {
//         this.localQuery.query = '';
//         this.submit();
//       };
//
//       $scope.$watch('queryBar.query', (newQuery) => {
//         this.localQuery = {
//           ...newQuery
//         };
//       }, true);
//     })
//   };
//
// });
