(function() {
  'use strict';

  angular
    .module('app.controller')
    .controller('TopicsController', TopicsController);

  ////////////////////////////////////////////////////////////

  /* @ngInject */
  function TopicsController($scope,
    ionicMaterialInk, ionicMaterialMotion, $timeout,
    $stateParams, BaseService, TopicService) {
    var vm = this;
    vm.topics = {};
    vm.current_page = 1; // 当前页码

    // Functions
    vm.doRefresh = doRefresh;
    vm.loadMore = loadMore;

    activate();

    function activate() {
      $timeout(function() {
        ionicMaterialInk.displayEffect();
        ionicMaterialMotion.ripple();
      }, 0);
      vm.current_page = 1;
      BaseService.showLoading('ios', '加载中...');
      loadData($stateParams.node_id, $stateParams.type)
        .then(function(result) {
          vm.topics = result;
          BaseService.hideLoading();
        });
    }

    function loadData(node_id, node_type, offset) {
      return TopicService.getTopics(node_id, node_type, offset)
        .then(function(result) {
          var topics = {};
          topics.type = $stateParams.type;
          topics.title = $stateParams.node_name;
          topics.items = result.topics;
          topics.header_template = result.header_template;
          return topics;
        })
        .catch(function(err) {
          return err;
        });
    }

    function doRefresh() {
      vm.current_page = 1;
      loadData($stateParams.node_id, $stateParams.type, 1)
        .then(function(result) {
          vm.topics = result;
          $scope.$broadcast('scroll.refreshComplete');
        });
    }

    function loadMore() {
      vm.current_page++;
      return loadData($stateParams.node_id, $stateParams.type, vm.current_page)
        .then(function(result) {
          vm.has_more = result.items && result.items.length > 0;
          if (!vm.has_more) {
            vm.current_page--;
          } else {
            vm.topics.items = _.union(vm.topics.items, result.items);
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        });
    }
  }

})();
