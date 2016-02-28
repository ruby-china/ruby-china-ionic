(function() {
  'use strict';

  angular
    .module('app.controller')
    .controller('NotificationsController', NotificationsController);

  ////////////////////////////////////////////////////////////

  /* @ngInject */
  function NotificationsController($scope, $rootScope, BaseService, UserService) {
    var vm = this;
    vm.current_page = 1; // 当前页码
    vm.notifications = [];

    // Functions
    vm.doRefresh = doRefresh;
    vm.loadMore = loadMore;
    vm.deleteAllNotifications = deleteAllNotifications;

    activate();

    function activate() {
      vm.current_page = 1;

      loadData().then(function(result) {
        vm.notifications = result;
        var unread_items = _.filter(result, function(item) {
          return item.read == false;
        });
        var ids = _.pluck(unread_items, 'id');
        UserService.markNotificationsRead(ids);

        $rootScope.$broadcast('unread_notifications_count', 0);

        BaseService.formatTopicBody();
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

    function deleteAllNotifications() {
      BaseService.confirm("清除通知", "", "确定要将你的所有通知清空吗？").then(function(res) {
        UserService.deleteAllNotifications().then(function(res) {
          doRefresh();
        });
      });
    }

    $scope.$on('$ionicView.beforeEnter', function(viewInfo, state) {
      BaseService.statusBar(0);
    });

  }

})();
