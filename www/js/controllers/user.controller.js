(function() {
  'use strict';

  angular
    .module('app.controller')
    .controller('UserController', UserController);

  ////////////////////////////////////////////////////////////

  /* @ngInject */
  function UserController($stateParams,
    ionicMaterialInk, ionicMaterialMotion, $timeout,
    BaseService, AuthService, UserService) {
    var vm = this;
    vm.user = {}; // 所查看的用户
    vm.current_user = AuthService.getCurrentUser(); // 本人
    vm.is_follow = false;
    vm.is_block = false;

    // Functions
    vm.isSelf = isSelf;

    activate();

    function activate() {
      $timeout(function() {
        ionicMaterialInk.displayEffect();
        ionicMaterialMotion.ripple();
      }, 0);

      BaseService.showLoading('ios', '加载中...');
      return AuthService.getUserInfo($stateParams.login)
        .then(function(result) {
          BaseService.hideLoading();
          vm.user = result.user;
          return vm.user;
        });
    }

    function isSelf() {
      return !!vm.current_user &&
        vm.current_user.login === $stateParams.login;
    }

    function follow() {
      return UserService.userAction($stateParams.login, 'follow')
        .then(function(result) {

        })
    }
  }

})();
