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
      getReply: getReply,
      updateReply: updateReply,
      destroyReply: destroyReply,
      getAllNodes: getAllNodes,
      createTopic: createTopic,
      likeTopic: likeTopic,
      unlikeTopic: unlikeTopic,
      like: like,
      favorite: favorite,
      follow: follow,
      destroy: destroy
    };

    return service;

    function getTopics(node_id, type, offset) {
      var q = $q.defer();
      var url = rbchina_api.url_prefix + '/topics.json';
      $http.get(url, {
          params: {
            node_id: node_id,
            type: type,
            offset: offset,
            limit: 20
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

    function like(able_type, able_id, liked) {
      var q = $q.defer();
      var url = rbchina_api.url_prefix + '/likes.json?obj_type=' + able_type + '&obj_id=' + able_id;
      var method = liked == true ? 'DELETE' : 'POST';

      $http({
        method: method,
        url: url
      }).success(function(result) {
        q.resolve(result);
      }).error(function(err) {
        q.reject(err);
      });
      return q.promise;
    }

    function likeTopic(topic_id) {
      var q = $q.defer();
      var url = rbchina_api.url_prefix + '/likes.json';
      var params = {
        obj_type: 'topic',
        obj_id: topic_id,
        access_token: AuthService.getAccessToken()
      };

      $http.post(url, params).success(function(result) {
        q.resolve(result);
      }).error(function(err) {
        q.reject(err);
      });
      return q.promise;
    }

    function unlikeTopic(topic_id) {
      var q = $q.defer();
      var url = rbchina_api.url_prefix + '/likes.json?obj_type=topic&obj_id=' + topic_id;

      $http.delete(url).success(function(result) {
        q.resolve(result);
      }).error(function(err) {
        q.reject(err);
      });
      return q.promise;
    }

    function favorite(topic_id, favorited) {
      var q = $q.defer();
      var method = favorited == true ? 'unfavorite' : 'favorite';
      var url = rbchina_api.url_prefix + '/topics/' + topic_id + '/'+ method +'.json';
      $http.post(url).success(function(result) {
        q.resolve(result);
      }).error(function(err) {
        q.reject(err);
      });
      return q.promise;
    }

    function follow(topic_id, followd) {
      var q = $q.defer();
      var method = followd == true ? 'unfollow' : 'follow';
      var url = rbchina_api.url_prefix + '/topics/' + topic_id + '/' + method + '.json';
      $http.post(url).success(function(result) {
        q.resolve(result);
      }).error(function(err) {
        q.reject(err);
      });
      return q.promise;
    }

    function getTopicWithReplies(topic_id) {
      var q = $q.defer();
      getTopic(topic_id)
        .then(function(result) {
          var topic = result;
          var url = rbchina_api.url_prefix + '/topics/' + topic_id + '/replies.json';
          $http.get(url)
            .success(function(response) {
              topic.replies = response.replies;
              topic.user_liked_reply_ids = response.meta.user_liked_reply_ids;
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
            offset: offset,
            limit: 20
          }
        })
        .success(function(result) {
          q.resolve(result);
        }).error(function(e) {
          q.reject(e);
        });
      return q.promise;
    }

    function getReply(reply_id) {
      var q = $q.defer();
      var url = rbchina_api.url_prefix + '/replies/' + reply_id + '.json';

      $http.get(url)
        .success(function(result) {
          q.resolve(result);
        }).error(function(err) {
          q.reject(err);
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

    function updateReply(reply_id, body) {
      var q = $q.defer();
      var url = rbchina_api.url_prefix + '/replies/' + reply_id + '.json';

      $http.post(url, { body: body })
        .success(function(result) {
          q.resolve(result);
        }).error(function(err) {
          q.reject(err);
        });
      return q.promise;
    }

    function destroyReply(reply_id) {
      var q = $q.defer();
      var url = rbchina_api.url_prefix + '/replies/' + reply_id + '.json';

      $http.delete(url)
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

    function destroy(topic_id) {
      var q = $q.defer();
      var url = rbchina_api.url_prefix + '/topics/' + topic_id + '.json';
      $http.delete(url).success(function(result) {
        q.resolve(result);
      }).error(function(err) {
        q.reject(err);
      });
      return q.promise;
    }

  }

})();
