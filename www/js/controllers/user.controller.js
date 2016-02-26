(function() {
  'use strict';

  angular
    .module('app.controller')
    .controller('UserController', UserController);

  ////////////////////////////////////////////////////////////

  /* @ngInject */
  function UserController($stateParams,
    $timeout, BaseService, AuthService, UserService) {
    var vm = this;
    vm.user = {}; // 所查看的用户
    vm.current_user = AuthService.getCurrentUser(); // 本人
    vm.is_follow = false;
    vm.is_block = false;

    // Functions
    vm.isSelf = isSelf;
    vm.toggleFollow = toggleFollow;
    vm.toggleBlock = toggleBlock;

    activate();

    function activate() {

      return AuthService.getUserInfo($stateParams.login)
        .then(function(result) {

          vm.user = result.user;
          vm.is_follow = result.meta.followed;
          vm.is_block = result.meta.blocked;
          return vm.user;
        });
    }

    function isSelf() {
      return !!vm.current_user &&
        vm.current_user.login === $stateParams.login;
    }

    function toggleFollow() {
      if (!vm.current_user) {
        BaseService.showModal('login-modal');
        return;
      }
      var follow = vm.is_follow ? 'unfollow' : 'follow';
      return UserService.userAction($stateParams.login, follow)
        .then(function(result) {
          vm.is_follow ? vm.user.followers_count-- : vm.user.followers_count++;
          vm.is_follow = !vm.is_follow;
        });
    }

    function toggleBlock() {
      if (!vm.current_user) {
        BaseService.showModal('login-modal');
        return;
      }
      var block = vm.is_block ? 'unblock' : 'block';
      return UserService.userAction($stateParams.login, block)
        .then(function(result) {
          vm.is_block = !vm.is_block;
        });
    }

    $scope.$on('$ionicView.beforeEnter', function(viewInfo, state) {
      BaseService.statusBar(1);
    });
  }

})();
