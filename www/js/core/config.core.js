(function() {
  'use strict';

  angular
    .module('app.core')
    .config(oauthConfig)
    // .config(oauthConfigDevelopment)
    .config(backButtonConfig)
    .config(loadbarConfig)
    .constant('rbchina_api', {
      url_prefix: "https://ruby-china.org/api/v3"
      // url_prefix: "http://localhost:3000/api/v3"
    });

  ////////////////////////////////////////////////////////////

  /* @ngInject */
  function oauthConfig(OAuthProvider) {
    OAuthProvider.configure({
      baseUrl: 'https://ruby-china.org',
      grantPath: '/oauth/token',
      revokePath: '/oauth/revoke',
      clientId: 'b9a6f45c',
      clientSecret: '469278baa8fa3a9eee54f0c618c6924893e45fc02263e2163a693402d62a7f9d'
    });
  }

  function oauthConfigDevelopment(OAuthProvider) {
    OAuthProvider.configure({
      baseUrl: 'http://localhost:3000',
      grantPath: '/oauth/token',
      revokePath: '/oauth/revoke',
      clientId: '1fc177e0',
      clientSecret: '6259c0829ff85e06e9fc41460a429380da5f53ec9bf29a5d6742e9504819a1a3'
    });
  }

  /* @ngInject */
  function backButtonConfig($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('').icon('mdi mdi-arrow-left');
  }

  /* @ngInject */
  function loadbarConfig(cfpLoadingBarProvider) {

  }

})();
