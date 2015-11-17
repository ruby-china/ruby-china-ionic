(function() {
  'use strict';

  angular
    .module('app.core')
    .config(routeConfig);

  ////////////////////////////////////////////////////////////

  /* @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'MainController as vm'
      })
      .state('app.topics', {
        url: '/topics',
        params: {
          type: 'last_actived'
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/topics.html',
            controller: 'TopicsController as vm'
          }
        }
      })
      // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/topics');
  }

})();
