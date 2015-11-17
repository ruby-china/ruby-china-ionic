(function() {
  'use strict';

  angular
    .module('app.controller')
    .controller('MainController', MainController);

  ////////////////////////////////////////////////////////////

  /* @ngInject */
  function MainController($scope, ionicMaterialInk, ionicMaterialMotion,
    $ionicSideMenuDelegate, $timeout, BaseService, AuthService) {

    var vm = this;
    vm.current_user = {};
    vm.is_logined = false;
    vm.account = {};
    vm.errorMsg = "";

    // Functions
    vm.showLoginModal = showLoginModal;
    vm.closeLoginModal = closeLoginModal;
    vm.login = login;
    vm.logout = logout;

    activate();

    function activate() {
      $timeout(function() {
        ionicMaterialInk.displayEffect();
        ionicMaterialMotion.ripple();
      }, 0);
      loadData("");
      BaseService.registModal('modals/login.html', 'login-modal', $scope);
    }

    function loadData(err) {
      vm.errorMsg = err;
      vm.current_user = AuthService.getCurrentUser() || {};
      vm.is_logined = AuthService.isAuthencated();
    }

    function showLoginModal() {
      BaseService.showModal('login-modal');
    }

    function closeLoginModal() {
      BaseService.hideModal('login-modal');
    }

    function login() {
      BaseService.showLoading('ios', '登录中...');
      return AuthService.login(vm.account)
        .then(function(result) {
          loadData("");
          BaseService.hideLoading();
          BaseService.hideModal('login-modal');
        }, function(err) {
          vm.errorMsg = err;
          BaseService.hideLoading();
        })
    }

    function logout() {
      AuthService.logout();
      loadData("");
    }
  }

})();
