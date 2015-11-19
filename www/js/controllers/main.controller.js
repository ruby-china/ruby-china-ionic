(function() {
  'use strict';

  angular
    .module('app.controller')
    .controller('MainController', MainController);

  ////////////////////////////////////////////////////////////

  /* @ngInject */
  function MainController($scope, ionicMaterialInk, ionicMaterialMotion, $ionicActionSheet,
    $ionicSideMenuDelegate, $timeout, BaseService, AuthService, CameraService, TopicService) {

    var vm = this;
    vm.current_user = {};
    vm.is_logined = false;
    vm.account = {};
    vm.errorMsg = "";
    vm.nodes = [];
    vm.new_topic = {};

    // Functions
    vm.showLoginModal = showLoginModal;
    vm.closeLoginModal = closeLoginModal;
    vm.login = login;
    vm.logout = logout;
    vm.showNewTopicModal = showNewTopicModal;
    vm.closeNewTopicModal = closeNewTopicModal;
    vm.moreAction = moreAction;
    vm.createTopic = createTopic;

    activate();

    function activate() {
      $timeout(function() {
        ionicMaterialInk.displayEffect();
        ionicMaterialMotion.ripple();
      }, 0);
      loadData("");
      BaseService.registModal('modals/login.html', 'login-modal', $scope);
      BaseService.registModal('modals/new_topic.html', 'new-topic-modal', $scope);
    }

    function loadData(err) {
      vm.errorMsg = err;
      vm.current_user = AuthService.getCurrentUser() || {};
      vm.is_logined = AuthService.isAuthencated();
      vm.account = {};
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

    function showNewTopicModal() {
      BaseService.showModal('new-topic-modal')
        .then(function() {
          TopicService.getAllNodes()
            .then(function(result) {
              vm.nodes = result.nodes;
              return vm.nodes;
            });
        });
    }

    function closeNewTopicModal() {
      BaseService.hideModal('new-topic-modal');
    }

    function moreAction() {
      var options = {
        buttons: [{
          text: '<i class="mdi mdi-image-area"></i> 从相册添加图片'
        }, {
          text: '<i class="mdi mdi-camera"></i> 从相机添加图片'
        }],
        titleText: '更多',
        cancelText: '取消',
        buttonClicked: function(index) {
          document.addEventListener("deviceready", function() {
            var size = {
              width: 800,
              height: 600
            };
            return CameraService.getPicture(index, size, 0)
              .then(function(result) {
                BaseService.uploadPicture(result)
                  .then(function(img) {
                    var img_url = '![](' + img.image_url + ')';
                    var prev = vm.new_topic.body.length === 0 ? '' : vm.new_topic.body + "\r\n";
                    vm.new_topic.body = prev + img_url;
                  });
              });
          }, false);

          return true;
        }
      }
      return $ionicActionSheet.show(options);
    }

    // 发表新话题
    function createTopic() {
      BaseService.showLoading('ios', '提交中...');
      TopicService.createTopic(vm.new_topic.title, vm.new_topic.body, vm.new_topic.node_id)
        .then(function(result) {
          closeNewTopicModal();
          $scope.$broadcast('new_topic_success');
          vm.new_topic = {};
          BaseService.hideLoading();
        }, function(err) {
          BaseService.hideLoading();
          BaseService.alert('发表新话题', '提交失败', err.error);
        })
    }
  }

})();
