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
      getRepliesByTopic: getRepliesByTopic,
      createReply: createReply,
      getAllNodes: getAllNodes,
      createTopic: createTopic
    };

    return service;

    function getTopics(node_id, type, offset) {
      var q = $q.defer();
      var url = rbchina_api.url_prefix + '/topics.json';
      $http.get(url, {
          params: {
            node_id: node_id,
            type: type,
            offset: offset
          }
        })
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

    function getRepliesByTopic(topic_id, offset) {
      var q = $q.defer();
      var url = rbchina_api.url_prefix + '/topics/' + topic_id + '/replies.json';
      $http.get(url, {
          params: {
            offset: offset
          }
        })
        .success(function(result) {
          q.resolve(result);
        }).error(function(e) {
          q.reject(e);
        });
      return q.promise;
    }

    // 提交回复
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

    // 获取所有节点名称
    function getAllNodes() {
      var q = $q.defer();
      var url = rbchina_api.url_prefix + '/nodes.json';
      $http.get(url)
        .success(function(result) {
          q.resolve(result);
        }).error(function(err) {
          q.reject(err);
        });
      return q.promise;
    }

    // 创建话题
    function createTopic(title, body, node_id) {
      var q = $q.defer();
      var url = rbchina_api.url_prefix + '/topics.json';
      var data = {
        title: title,
        body: body,
        node_id: node_id,
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
