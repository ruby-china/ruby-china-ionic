(function() {
  'use strict';

  angular
    .module('app.controller')
    .controller('TopicController', TopicController);

  ////////////////////////////////////////////////////////////

  /* @ngInject */
  function TopicController($rootScope, $scope, $stateParams, $timeout, $ionicActionSheet,
    ionicMaterialInk, ionicMaterialMotion, $cordovaInAppBrowser,
    BaseService, AuthService, TopicService, CameraService) {
    var vm = this;
    vm.is_logined = false;
    vm.topic = {};
    vm.replies = [];
    vm.reply_content = "";
    vm.current_page = 1; // 当前页码

    // Functions
    vm.showReplyModal = showReplyModal;
    vm.closeReplyModal = closeReplyModal;
    vm.moreAction = moreAction;
    vm.createReply = createReply;
    vm.loadMore = loadMore;

    activate();

    function activate() {
      $timeout(function() {
        ionicMaterialInk.displayEffect();
        ionicMaterialMotion.ripple();
      }, 0);

      vm.is_logined = AuthService.isAuthencated();
      vm.reply_content = "";
      BaseService.registModal('modals/reply.html', 'reply-modal', $scope, {
        focusFirstInput: true
      });
      
      return TopicService.getTopicWithReplies($stateParams.topic_id)
        .then(function(result) {
          
          vm.topic = result.topic;
          vm.replies = result.replies;
          vm.has_more = vm.replies.length === 20; // 默认这里20条一页
          $timeout(function() {
            // 处理外部链接
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

            // 处理@链接
            var atuser_links = $('.at_user');
            _.forEach(atuser_links, function(link) {
              var orig = $(link).attr("href");
              $(link).attr("href", "#/app/user/" + orig.slice(1));
            });
          });
        });
    }

    function showReplyModal() {
      vm.is_logined = AuthService.isAuthencated();
      if (!vm.is_logined) {
        BaseService.showModal('login-modal');
      } else {
        BaseService.showModal('reply-modal')
          .then(function() {
            $('#topic-reply').on('focus', function() {
              $('#reply-modal')
                .css("transform", "translate(0px, -" + $rootScope.keyboardHeight + "px)");
            })
            $('#topic-reply').on('blur', function() {
              $('#reply-modal')
                .css("transform", "translate(0px, 0px)");
            })
          });
      }
    }

    function closeReplyModal() {
      BaseService.hideModal('reply-modal');
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
                    var prev = vm.reply_content.length === 0 ? '' : vm.reply_content + "\r\n";
                    vm.reply_content = prev + img_url;
                  });
              });
          }, false);

          return true;
        }
      }
      return $ionicActionSheet.show(options);
    }


    // 提交回帖
    function createReply() {
      TopicService.createReply($stateParams.topic_id, vm.reply_content)
        .then(function(result) {
          closeReplyModal();
          vm.replies.push(result.reply);
          vm.reply_content = "";
          
        }).catch(function(err) {
          
          BaseService.alert('提交回复', '', '提交失败！');
        })
    }

    function loadMore() {
      vm.current_page++;
      return TopicService.getRepliesByTopic($stateParams.topic_id, vm.current_page)
        .then(function(result) {
          vm.has_more = result.replies && result.replies.length > 0;
          if (!vm.has_more) {
            vm.current_page--;
          } else {
            vm.replies = _.union(vm.replies, result.replies);
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        });
    }

    $scope.$on('$ionicView.leave', function(viewInfo, state) {
      if (state.direction === "back") {
        BaseService.recycleModalById('reply-modal');
      }
    })
  }

})();
