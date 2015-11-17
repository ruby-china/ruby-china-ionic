(function() {
  'use strict';

  angular
    .module('app.service')
    .factory('TopicService', TopicService);

  ////////////////////////////////////////////////////////////

  /* @ngInject */
  function TopicService($q, $http, AuthService, rbchina_api) {
    // 根据不同节点在首页显示不同的Header
    var topics_headers = [{
      node_id: undefined,
      header_template: 'templates/topics/_filters.html'
    }];
    var service = {
      getTopics: getTopics,
      getTopicWithReplies: getTopicWithReplies,
      createReply: createReply
    };

    return service;

    function getTopics(node_id, type) {
      var q = $q.defer();
      var url = rbchina_api.url_prefix + '/topics.json';
      if (node_id) {
        url = url.concat('?node_id=' + node_id);
      }
      if (type) {
        url = url.concat('?type=' + type);
      }
      $http.get(url)
        .success(function(result) {
          result.header_template = _.result(_.findWhere(topics_headers, {
            node_id: node_id
          }), 'header_template');
          q.resolve(result);
        }).error(function(err) {
          q.reject(err);
        });
      return q.promise;
    }

    function getTopic(topic_id) {
      var q = $q.defer();
      var url = rbchina_api.url_prefix + '/topics/' + topic_id + '.json';
      $http.get(url).success(function(result) {
        q.resolve(result);
      }).error(function(err) {
        q.reject(err);
      });
      return q.promise;
    }

    function getTopicWithReplies(topic_id) {
      var q = $q.defer();
      var url = rbchina_api.url_prefix + '/topics/' + topic_id + '/replies.json';
      getTopic(topic_id)
        .then(function(result) {
          var topic = result;
          $http.get(url)
            .success(function(response) {
              topic.replies = response.replies;
              q.resolve(topic);
            }).error(function(e) {
              q.reject(e);
            });
        });
      return q.promise;
    }

    function createReply(topic_id, body) {
      var q = $q.defer();
      var url = rbchina_api.url_prefix + '/topics/' + topic_id + '/replies.json';
      var data = {
        body: body,
        access_token: AuthService.getAccessToken()
      };
      $http.post(url, data)
        .success(function(result) {
          q.resolve(result);
        }).error(function(err) {
          q.reject(err);
        });
      return q.promise;
    }

  }

})();
