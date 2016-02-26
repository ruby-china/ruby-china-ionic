(function() {
  'use strict';

  angular
    .module('app.core')
    .run(ionicRun)
    .run(oauthRun);

  ////////////////////////////////////////////////////////////

  /* @ngInject */
  function ionicRun($rootScope, $ionicPlatform, amMoment) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }
      window.addEventListener('native.keyboardshow', function(event) {
        $rootScope.keyboardHeight = event.keyboardHeight;
      });
    });
    amMoment.changeLocale('zh-cn');
  }

  /* @ngInject */
  function oauthRun($rootScope, $window, OAuth) {
    $rootScope.$on('oauth:error', function(event, rejection) {
      // Ignore `invalid_grant` error - should be catched on `LoginController`.
      if ('invalid_grant' === rejection.data.error) {
        return;
      }

      // Refresh token when a `invalid_token` error occurs.
      if ('invalid_token' === rejection.data.error) {
        return OAuth.getRefreshToken();
      }

      // Redirect to `/login` with the `error_reason`.
      return $window.location.href = '/login?error_reason=' + rejection.data.error;
    });
  }

})();
