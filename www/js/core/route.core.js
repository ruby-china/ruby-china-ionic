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
      .state('app.rbdev', {
        url: '/rbdev',
        params: {
          node_id: '23', // 社区开发的ID是23
          node_name: '社区开发'
        },
        views: {
          'menuContent': {
            templateUrl: 'topics.html',
            controller: 'TopicsController as vm'
          }
        }
      })
      .state('app.nopoint', {
        url: '/nopoint',
        params: {
          node_id: '61', // NoPoint的ID是61
          node_name: 'NoPoint'
        },
        views: {
          'menuContent': {
            templateUrl: 'topics.html',
            controller: 'TopicsController as vm'
          }
        }
      })
      .state('app.topic', {
        url: '/topic/:topic_id',
        params: {
          replies_count: null
        },
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
      })
      .state('app.notification', {
        url: '/notifications',
        views: {
          'menuContent': {
            templateUrl: 'notifications.html',
            controller: 'NotificationsController as vm'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/topics/last_actived');
  }

})();
