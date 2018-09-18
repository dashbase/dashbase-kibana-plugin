import chrome from 'ui/chrome';

chrome
    .setVisible(false)
    .setRootController('logout', ($window) => {
        // Redirect user to the server logout endpoint to complete logout.
        $window.location.href = chrome.addBasePath(`/`);
    });