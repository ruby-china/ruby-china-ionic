(function() {
  'use strict';

  angular
    .module('app.controller')
  .controller('MainController', MainController);

  ////////////////////////////////////////////////////////////

  /* @ngInject */
  function MainController($rootScope, $scope, $state, $ionicScrollDelegate, $ionicPopup, $ionicHistory,
    $timeout, BaseService, UserService, AuthService, $location, $cordovaAppVersion, $cordovaPushV5,
    CameraService, TopicService, $window) {

    initPushNotification();

    var vm = this;
    vm.current_user = {};
    vm.is_logined = false;
    vm.account = {};
    vm.errorMsg = "";
    vm.nodes = [];
    vm.new_topic = {};

    $ionicHistory.nextViewOptions({
      historyRoot: true
    });

    // Functions
    vm.showLoginModal = showLoginModal;
    vm.showRegisterModal = showRegisterModal;
    vm.closeLoginModal = closeLoginModal;
    vm.login = login;
    vm.logout = logout;
    vm.showNewTopicModal = showNewTopicModal;
    vm.closeNewTopicModal = closeNewTopicModal;
    // vm.moreAction = moreAction;
    vm.createTopic = createTopic;

    vm.imageByCamera = imageByCamera;
    vm.imageByGallery = imageByGallery;
    vm.insertCode = insertCode;
    vm.atSomebody = atSomebody;
    vm.insertEmoji = insertEmoji;
    vm.unread_notifications_count = 0;

    activate();
    loadAppVerion();

    function activate() {
      loadData("");

      UserService.getUnreadNotificationsCount().then(function(res) {
        vm.unread_notifications_count = res.count;
      });

      BaseService.registModal('modals/login.html', 'login-modal', $scope, {
        focusFirstInput: true
      });
      BaseService.registModal('modals/new_topic.html', 'new-topic-modal', $scope, {
        focusFirstInput: true
      });
    }

    function loadData(err) {
      vm.errorMsg = err;
      vm.current_user = AuthService.getCurrentUser() || {};
      vm.is_logined = AuthService.isAuthencated();
      vm.account = {};
    }

    function loadAppVerion() {
      document.addEventListener("deviceready", function () {
        // only working on Device, not browser
        $cordovaAppVersion.getVersionNumber().then(function (version) {
          console.log(version);
          vm.appVersion = version;
        });
      }, false);
    }

    function showLoginModal() {
      BaseService.showModal('login-modal');
    }

    function showRegisterModal() {
      BaseService.openUrl('https://ruby-china.org/account/sign_up');
    }

    function closeLoginModal() {
      BaseService.hideModal('login-modal');
    }

    function login() {
      return AuthService.login(vm.account)
        .then(function(result) {
          loadData("");

          BaseService.hideModal('login-modal');
        }, function(err) {
          vm.errorMsg = err;
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
              // 减40是减掉操作条的高度；减12是减掉padding
              vm.textarea_origin_height =
                document.documentElement.clientHeight - $('.bar-header').height() - 40 - 12;

              setTextareaHeight($rootScope.keyboardHeight);

              // 光标进入内容区，操作条上来
              $("#new-topic").on('focus', function(event) {
                $location.hash('new-topic');
                $ionicScrollDelegate.$getByHandle('new-topic').anchorScroll(true);
                moreActionPutup($rootScope.keyboardHeight);
              });

              // 光标离开内容区，操作条回去
              $("#new-topic").on('blur', function() {
                moreActionDown();
                $ionicScrollDelegate.$getByHandle('new-topic').scrollTop(true);
              });

              $("#new-topic-title").on('focus', function() {
                setTextareaHeight($rootScope.keyboardHeight);
                $ionicScrollDelegate.$getByHandle('new-topic').scrollTop(true);
              })

              return vm.nodes;
            });
        });
    }

    function closeNewTopicModal() {
      BaseService.hideModal('new-topic-modal')
        .then(function() {
          vm.new_topic = {};
          $('#new-topic').css("max-height", "31px");
        });
    }

    // 处理操作条的方法不太完美，后期改进
    // 操作条提上来
    function moreActionPutup(height) {
      $('#more-actions')
        .css("transform", "translate(0px, -" + height + "px)");
    }

    // 操作条回到底部
    function moreActionDown() {
      $('#more-actions')
        .css("transform", "translate(0px, 0px)");
    }

    // 设置文本区高度，传入的是需要减少的高度，而非设定值
    function setTextareaHeight(height) {
      $('#new-topic')
        .css("max-height", vm.textarea_origin_height - height)
        .height(vm.textarea_origin_height - height);
    }

    // 发表新话题
    function createTopic() {
      TopicService.createTopic(vm.new_topic.title, vm.new_topic.body, vm.new_topic.node_id)
        .then(function(result) {
          closeNewTopicModal();
          $scope.$broadcast('new_topic_success');
          BaseService.alert('发表新话题', '', '话题发布成功。');
          vm.new_topic = {};
        }, function(err) {
          BaseService.alert('发表新话题', '提交失败', err.error);
        })
    }

    // 来自相机的照片
    function imageByCamera() {
      moreActionDown();
      document.addEventListener("deviceready", function() {
        var size = {
          width: 600,
          height: 600
        };
        return CameraService.getPicture(1, size, 0)
          .then(function(result) {
            BaseService.uploadPicture(result)
              .then(function(img) {
                var img_url = '![](' + img.image_url + ')';
                var prev = vm.new_topic.body.length === 0 ? '' : vm.new_topic.body + "\r\n";
                vm.new_topic.body = prev + img_url;
              });
          });
      }, false);
    }

    // 来自相册的照片
    function imageByGallery() {
      moreActionDown();
      document.addEventListener("deviceready", function() {
        var size = {
          width: 600,
          height: 600
        };
        return CameraService.getPicture(0, size, 0)
          .then(function(result) {
            BaseService.uploadPicture(result)
              .then(function(img) {
                var img_url = '![](' + img.image_url + ')';
                var prev = vm.new_topic.body.length === 0 ? '' : vm.new_topic.body + "\r\n";
                vm.new_topic.body = prev + img_url;
              });
          });
      }, false);
    }

    // 插入代码
    function insertCode() {
      // moreActionDown();
      var popup = $ionicPopup.show({
        templateUrl: 'modals/code_selector.html',
        title: '请选择代码语言',
        cssClass: 'code_selector',
        scope: $scope,
        buttons: [{
          text: '<b>确认</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (vm.code_id) {
              var code = "```" + vm.code_id + "\r\n" + "\r\n" + "```";
              var prev = (!vm.new_topic.body || vm.new_topic.body.length === 0) ? '' : vm.new_topic.body + "\r\n";
              vm.new_topic.body = prev + code;
            };
          }
        }, {
          text: '取消'
        }]
      });
      popup.then(function() {
        vm.code_id = undefined;
      })
    }

    // @某人
    function atSomebody() {
      moreActionDown();
    }

    // 插入表情
    function insertEmoji() {
      moreActionDown();
    }

    function initPushNotification() {
      var config = {
        ios: {
          "badge": true,
          "sound": true,
          "alert": true
        }
      };

      document.addEventListener("deviceready", function(){
        $cordovaPushV5.initialize(config).then(function(result) {
          $cordovaPushV5.onNotification();
          $cordovaPushV5.onError();
          $cordovaPushV5.register().then(function (deviceToken) {
            console.log("deviceToken: " + deviceToken)
            AuthService.submitDeviceToken(deviceToken).then(function(res) { });
          }, function (err) {
            // handle error
            console.log("Registration error: " + err)
          });
        });
      }, false);

      document.addEventListener('resume', function() {
        var goafterpush = $window.localStorage['goafterpush'];
        if (goafterpush == 1) {
          $window.localStorage['goafterpush'] = null;
          $state.go('app.notification');
        }
      });
    }

    $rootScope.$on('relogin', function() {
      // 自动重新登录
      AuthService.refreshAccessToken().then(function(res) {
        console.log('refreshAccessToken result', res);
      }).catch(function(err) {
        console.log('Will logout');
        AuthService.logout();
        showLoginModal();
      });
    });

    $rootScope.$on('unread_notifications_count', function(event, count) {
      vm.unread_notifications_count = count;
    });

    $rootScope.$on('$cordovaPushV5:notificationReceived', function(event, notification) {
      // if (notification.alert) {
      //   navigator.notification.alert(notification.alert);
      // }

      if (notification.sound) {
        var snd = new Media(event.sound);
        snd.play();
      }

      // store state for open /notifications page when rescume app.
      $window.localStorage['goafterpush'] = 1;

      if (notification.badge) {
        vm.unread_notifications_count = notification.badge;

        $cordovaPushV5.setBadgeNumber(notification.badge).then(function(result) {
          // Success!
        }, function(err) {
          // An error occurred. Show a message to the user
        });
      }
    });
  }

})();
