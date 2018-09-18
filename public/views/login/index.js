import React from 'react';
import { uiModules } from 'ui/modules';
import chrome from 'ui/chrome';
import { render, unmountComponentAtNode } from 'react-dom';

import 'ui/autoload/styles';
import '../../less/main.less';
import { Main } from '../../components/main';

const app = uiModules.get("apps/login");

app.config($locationProvider => {
    $locationProvider.html5Mode({
        enabled: false,
        requireBase: false,
        rewriteLinks: false,
    });
});
app.config(stateManagementConfigProvider =>
    stateManagementConfigProvider.disable()
);

function RootController($scope, $element, $http) {
    window.a = $scope
    window.b = $element
    window.c = $http
    const domNode = $element[0];

    // render react to DOM
    render(<Main title="login" httpClient={$http} callback={chrome.addBasePath(`/auth/callback`)} />, domNode);

    // unmount react on controller destroy
    $scope.$on('$destroy', () => {
        unmountComponentAtNode(domNode);
    });
}

chrome.setVisible(false).setRootController("login", RootController);