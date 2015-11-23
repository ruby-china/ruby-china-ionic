(function() {
  'use strict';

  angular
    .module('app.controller')
    .controller('NotificationsController', NotificationsController);

  ////////////////////////////////////////////////////////////

  /* @ngInject */
  function NotificationsController($scope, BaseService, UserService) {
    var vm = this;
    vm.current_page = 1; // 当前页码
    vm.notifications = [];

    // Functions
    vm.doRefresh = doRefresh;
    vm.loadMore = loadMore;

    activate();

    function activate() {
      vm.current_page = 1;
      
      loadData().then(function(result) {
        vm.notifications = result;
        
      });
    }

    function loadData(offset) {
      return UserService.getUserNotifications(offset)
        .then(function(result) {
          return result;
        });
    }

    function doRefresh() {
      vm.current_page = 1;
      loadData().then(function(result) {
        vm.notifications = result;
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

    function loadMore() {
      vm.current_page++;
      return loadData(vm.current_page)
        .then(function(result) {
          vm.has_more = result.items && result.items.length > 0;
          if (!vm.has_more) {
            vm.current_page--;
          } else {
            vm.notifications = _.union(vm.notifications, result.items);
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        });
    }

  }

})();
