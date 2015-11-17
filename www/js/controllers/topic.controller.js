(function() {
  'use strict';

  angular
    .module('app.controller')
    .controller('TopicController', TopicController);

  ////////////////////////////////////////////////////////////

  /* @ngInject */
  function TopicController($scope, $stateParams, $timeout,
    ionicMaterialInk, ionicMaterialMotion, $cordovaInAppBrowser,
    BaseService, AuthService, TopicService) {
    var vm = this;
    vm.is_logined = false;
    vm.topic = {};

    // Functions
    vm.reply = reply;

    activate();

    function activate() {
      $timeout(function() {
        ionicMaterialInk.displayEffect();
        ionicMaterialMotion.ripple();
      }, 0);

      vm.is_logined = AuthService.isAuthencated();
      BaseService.showLoading('ios', '加载中...');
      return TopicService.getTopicWithReplies($stateParams.topic_id)
        .then(function(result) {
          BaseService.hideLoading();
          vm.topic = result.topic;
          vm.replies = result.replies;
          $timeout(function() {
            var exlinks = $('.ex-link');
            exlinks.click(function() {
              var url = $(this).attr('href');
              var options = {
                location: 'yes',
                clearcache: 'yes',
                toolbar: 'yes'
              };
              $cordovaInAppBrowser.open(encodeURI(url), '_blank', options)
                .then(function(event) {
                  // success
                })
                .catch(function(event) {
                  // error
                });
              return false;
            });
          });
        });
    }

    function reply() {
      if (!vm.is_logined) {
        BaseService.showModal('login-modal');
      } else {

      }
    }
  }

})();
