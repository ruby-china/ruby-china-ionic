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
    vm.current_user = {};

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
          vm.current_user = result.user;
          return vm.current_user;
        });
    }

    function isSelf() {
      var user = AuthService.getCurrentUser();
      return user && user.login === $stateParams.login;
    }
  }

})();
