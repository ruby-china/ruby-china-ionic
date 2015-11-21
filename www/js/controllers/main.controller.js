(function() {
  'use strict';

  angular
    .module('app.controller')
    .controller('MainController', MainController);

  ////////////////////////////////////////////////////////////

  /* @ngInject */
  function MainController($rootScope, $scope, ionicMaterialInk,
    ionicMaterialMotion, $ionicScrollDelegate, $ionicPopup,
    $timeout, BaseService, AuthService,
    CameraService, TopicService) {

    var vm = this;
    vm.current_user = {};
    vm.is_logined = false;
    vm.account = {};
    vm.errorMsg = "";
    vm.nodes = [];
    vm.new_topic = {};

    vm.codes = [{
      id: 'ruby',
      name: 'Ruby'
    }, {
      id: 'erb',
      name: 'HTML / ERB'
    }, {
      id: 'scss',
      name: 'CSS / SCSS'
    }, {
      id: 'js',
      name: 'JavaScript'
    }, {
      id: 'yml',
      name: 'YAML(.yml)'
    }, {
      id: 'coffee',
      name: 'CoffeeScript'
    }, {
      id: 'conf',
      name: 'Nginx / Redis'
    }, {
      id: 'python',
      name: 'Python'
    }, {
      id: 'php',
      name: 'PHP'
    }, {
      id: 'java',
      name: 'Java'
    }, {
      id: 'erlang',
      name: 'Erlang'
    }, {
      id: 'shell',
      name: 'Shell / Bash'
    }];

    // Functions
    vm.showLoginModal = showLoginModal;
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

    activate();

    function activate() {
      $timeout(function() {
        ionicMaterialInk.displayEffect();
        ionicMaterialMotion.ripple();
      }, 0);
      loadData("");
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
              setTextareaHeight(0);

              // 键盘弹出后，把底部操作条顶上来
              window.addEventListener('native.keyboardshow', function(event) {
                if ($("textarea[id=new-topic]:focus").length > 0) {
                  moreActionPutup(event.keyboardHeight);
                };
              });

              // 光标离开内容区，操作条回去
              $("#new-topic").on('blur', function() {
                moreActionDown();
              });

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

    // 界面调整 2015-11-20
    // function moreAction() {
    //   var options = {
    //     buttons: [{
    //       text: '<i class="mdi mdi-image-area"></i> 从相册添加图片'
    //     }, {
    //       text: '<i class="mdi mdi-camera"></i> 从相机添加图片'
    //     }],
    //     titleText: '更多',
    //     cancelText: '取消',
    //     buttonClicked: function(index) {
    //       document.addEventListener("deviceready", function() {
    //         var size = {
    //           width: 600,
    //           height: 600
    //         };
    //         return CameraService.getPicture(index, size, 0)
    //           .then(function(result) {
    //             BaseService.uploadPicture(result)
    //               .then(function(img) {
    //                 var img_url = '![](' + img.image_url + ')';
    //                 var prev = vm.new_topic.body.length === 0 ? '' : vm.new_topic.body + "\r\n";
    //                 vm.new_topic.body = prev + img_url;
    //               });
    //           });
    //       }, false);

    //       return true;
    //     }
    //   }
    //   return $ionicActionSheet.show(options);
    // }

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

    // 处理操作条的方法不太完美，后期改进
    // 操作条提上来
    function moreActionPutup(height) {
      $('#more-actions').css("transform", "translate(0px, -" + height + "px)");
      setTextareaHeight(height)
        .scrollTop($('#new-topic')[0].scrollHeight);
    }

    // 操作条回到底部
    function moreActionDown() {
      $('#more-actions').css("transform", "translate(0px, 0px)");
      setTextareaHeight(0);
    }

    function setTextareaHeight(height) {
      vm.textarea_max_height =
        document.documentElement.clientHeight - $('.bar-header').height() - 96 - 40;
      $('#new-topic').css("max-height", vm.textarea_max_height - height)
        .height(vm.textarea_max_height);
      return $('#new-topic');
    }
  }

})();
