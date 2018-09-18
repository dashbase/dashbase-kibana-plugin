import {chromeNavControlsRegistry} from 'ui/registry/chrome_nav_controls';
import {uiModules} from 'ui/modules';
import template from 'plugins/dashbase/chrome/nav/nav.html'
chromeNavControlsRegistry.register(() => ({
  name: 'btn-logout',
  template: template,
  order: 1000
}));
