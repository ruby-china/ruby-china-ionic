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
        templateUrl: 'menu.html',
        controller: 'MainController as vm'
      })
      .state('app.topics', {
        url: '/topics/:type',
        views: {
          'menuContent': {
            templateUrl: 'topics.html',
            controller: 'TopicsController as vm'
          }
        }
      })
      .state('app.jobs', {
        url: '/jobs',
        params: {
          node_id: '25', // 社区招聘的ID是25
          node_name: '招聘'
        },
        views: {
          'menuContent': {
            templateUrl: 'topics.html',
            controller: 'TopicsController as vm'
          }
        }
      })
      .state('app.topic', {
        url: '/topics/:topic_id',
        views: {
          'menuContent': {
            templateUrl: 'topic.html',
            controller: 'TopicController as vm'
          }
        }
      })
      .state('app.user', {
        url: '/user/:login',
        views: {
          'menuContent': {
            templateUrl: 'user/profile.html',
            controller: 'UserController as vm'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/topics/last_actived');
  }

})();
