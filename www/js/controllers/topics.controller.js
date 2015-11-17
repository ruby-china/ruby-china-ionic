(function() {
  'use strict';

  angular
    .module('app.controller')
    .controller('TopicsController', TopicsController);

  ////////////////////////////////////////////////////////////

  /* @ngInject */
  function TopicsController($scope, 
    // ionicMaterialInk, ionicMaterialMotion, $timeout,
    $stateParams, BaseService, TopicService) {
    var vm = this;
    vm.topics = {};

    // Functions
    vm.doRefresh = doRefresh;
    vm.hasMore = hasMore;
    vm.loadMore = loadMore;

    activate();

    function activate() {
      // $timeout(function() {
      //   ionicMaterialInk.displayEffect();
      //   ionicMaterialMotion.ripple();
      // }, 0);
      BaseService.showLoading('ios', '加载中...');
      loadData($stateParams.node_id, $stateParams.type)
        .then(function() {
          BaseService.hideLoading();
        });
    }

    function loadData(node_id, node_type) {
      return TopicService.getTopics(node_id, node_type)
        .then(function(result) {
          vm.topics.type = $stateParams.type;
          vm.topics.title = $stateParams.node_name;
          vm.topics.items = result.topics;
          vm.topics.header_template = result.header_template;
          return vm.topics;
        })
        .catch(function(err) {
          return err;
        });
    }

    function doRefresh() {
      loadData($stateParams.node_id, $stateParams.type)
        .then(function() {
          $scope.$broadcast('scroll.refreshComplete');
        });
    }

    function hasMore() {
      return true;
    }

    function loadMore() {

    }
  }

})();
