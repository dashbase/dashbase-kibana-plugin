import chrome from 'ui/chrome';
import {getNextUrl} from './get_next_url';


export default function LoginController(kbnUrl, $scope, $http, $window) {
  console.log("ui");

  const ROOT = chrome.getBasePath();
  const APP_ROOT = `${ROOT}`;
  const API_ROOT = `${APP_ROOT}/auth/api/v1`;

  localStorage.clear();
  sessionStorage.clear();
  // honor last request URL
  let nextUrl = getNextUrl($window.location.href, ROOT);
  this.submit = () => {
    try {
      $http.post(`${API_ROOT}/login`, this.payload)
        .then(
          (response) => {
            $window.location.href = `${nextUrl}`;
          },
          (error) => {
            if (error.status && error.status === 401) {
              this.errorMessage = 'Invalid token, please try again';
            } else {
              this.errorMessage = 'An error occurred while checking your token';
            }
          }
        );
    } catch (error) {
      this.errorMessage = 'An internal error has occured.';
    }


  };

};
