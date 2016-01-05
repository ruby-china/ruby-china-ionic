(function() {
  'use strict';

  angular
    .module('app.controller')
    .controller('TopicController', TopicController);

  ////////////////////////////////////////////////////////////

  /* @ngInject */
  function TopicController($rootScope, $scope, $stateParams, $timeout, $ionicActionSheet,
    ionicMaterialInk, ionicMaterialMotion, $ionicPopup, $cordovaInAppBrowser, $location,
    BaseService, AuthService, TopicService, CameraService) {
    var vm = this;
    vm.is_logined = false;
    vm.user_liked_reply_ids = [];
    vm.meta = {};
    vm.topic = {
      user: {
        avatar_url: '/img/default_avatar.png'
      },
      likes_count: 0,
      body_html: '',
      title: ''
    };
    vm.replies = [];
    vm.reply_content = "";
    vm.current_page = 1; // 当前页码

    // Functions
    vm.showTopicPopupMenu = showTopicPopupMenu;
    vm.showReplyModal = showReplyModal;
    vm.closeReplyModal = closeReplyModal;
    vm.moreAction = moreAction;
    vm.saveReply = saveReply;
    vm.loadMore = loadMore;
    vm.quoteReply = quoteReply;
    vm.editReply = editReply;
    vm.destroyReply = destroyReply;
    vm.likeReply = likeReply;
    vm.isReplyLiked = isReplyLiked;

    activate();

    function activate() {

      vm.is_logined = AuthService.isAuthencated();
      vm.reply_content = "";
      BaseService.registModal('modals/reply.html', 'reply-modal', $scope, {
        focusFirstInput: true
      });

      BaseService.showLoading('lines', '载入中...');

      return TopicService.getTopicWithReplies($stateParams.topic_id)
        .then(function(result) {
          BaseService.hideLoading();
          vm.meta = result.meta;
          vm.topic = result.topic;
          vm.replies = result.replies;
          vm.user_liked_reply_ids = result.user_liked_reply_ids;
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
      vm.edit_reply_id = null;
      vm.reply_content = "";
      vm.is_logined = AuthService.isAuthencated();
      if (!vm.is_logined) {
        BaseService.showModal('login-modal');
      } else {
        BaseService.showModal('reply-modal');
      }
    }

    function quoteReply(reply, floor) {
      vm.current_edit_reply = null;
      vm.reply_content = "#" + floor + "楼 @" + reply.user.login + " ";
      BaseService.showModal('reply-modal');
    }

    function likeReply(reply) {
      var liked = isReplyLiked(reply);
      TopicService.like('reply', reply.id, liked).then(function(result) {
        reply.likes_count = result.count;
        if (liked) {
          _.remove(vm.user_liked_reply_ids, function(id) {
            return id == reply.id
          });
        } else {
          vm.user_liked_reply_ids.push(reply.id);
        }
      });
    }

    function isReplyLiked(reply) {
      return vm.user_liked_reply_ids.indexOf(reply.id) != -1;
    }

    function editReply(reply) {
      vm.current_edit_reply = reply;
      TopicService.getReply(reply.id).then(function(result) {
        vm.reply_content = result.reply.body;
        BaseService.showModal('reply-modal');
      });
    }

    function destroyReply(reply) {
      BaseService.confirm('删除确认', '', '你确定要删除这个回帖么？').then(function(res) {
        TopicService.destroyReply(reply.id).then(function(result) {
          reply.deleted = true;
        });
      });
    }

    function closeReplyModal() {
      BaseService.hideModal('reply-modal');
    }

    function showTopicPopupMenu() {
      vm.is_logined = AuthService.isAuthencated();
      if (!vm.is_logined) {
        BaseService.showModal('login-modal');
        return true;
      };

      var likeButton = { text: '<i class="mdi mdi-thumb-up"></i> 赞' };
      var unlikeButton = { text: '<i class="mdi mdi-thumb-up"></i> 取消赞' };
      var favoriteButton = { text: '<i class="mdi mdi-star"></i> 收藏' };
      var unfavoriteButton = { text: '<i class="mdi mdi-star"></i> 取消收藏' };
      var followButton = { text: '<i class="mdi mdi-eye"></i> 关注' };
      var unfollowButton = { text: '<i class="mdi mdi-eye"></i> 取消关注' };
      var editButton = { text: '<i class="mdi mdi-pencil-box-outline"></i> 编辑' };
      var deleteButton = { text: '<i class="mdi mdi-delete"></i> 删除' };

      var buttons = [];
      if (vm.meta.liked) {
        buttons.push(unlikeButton);
      } else {
        buttons.push(likeButton);
      }

      if (vm.meta.favorited) {
        buttons.push(unfavoriteButton);
      } else {
        buttons.push(favoriteButton);
      }

      if (vm.meta.followed) {
        buttons.push(unfollowButton);
      } else {
        buttons.push(followButton);
      }

      if (vm.topic.abilities.update) {
        buttons.push(editButton);
      }

      if (vm.topic.abilities.destroy) {
        buttons.push(deleteButton);
      }

      var options = {
        buttons: buttons,
        cancelText: '取消',
        buttonClicked: function(index) {
          if (index == buttons.indexOf(likeButton)) {
            TopicService.likeTopic(vm.topic.id).then(function(result) {
              vm.topic.likes_count = result.count;
              vm.meta.liked = true;
            });
          }

          if (index == buttons.indexOf(unlikeButton)) {
            TopicService.unlikeTopic(vm.topic.id).then(function(result) {
              vm.topic.likes_count = result.count;
              vm.meta.liked = false;
            });
          }

          if (index == buttons.indexOf(favoriteButton) || index == buttons.indexOf(unfavoriteButton)) {
            TopicService.favorite(vm.topic.id, vm.meta.favorited).then(function(result) {
              vm.meta.favorited = !vm.meta.favorited;
            });
          }

          if (index == buttons.indexOf(followButton) || index == buttons.indexOf(unfollowButton)) {
            TopicService.follow(vm.topic.id, vm.meta.followed).then(function(result) {
              vm.meta.followed = !vm.meta.followed;
            });
          }

          if (index == buttons.indexOf(editButton)) {
          }

          if (index == buttons.indexOf(deleteButton)) {
            BaseService.confirm('删除确认', '', '你确定要删除这个话题么？').then(function(res) {
              TopicService.destroy(vm.topic.id).then(function(result) {
                $location.path('/app/topics/last_actived');
              });
            });
          }

          return true;
        }
      };
      return $ionicActionSheet.show(options);
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
    function saveReply() {
      if (vm.current_edit_reply) {
        TopicService.updateReply(vm.current_edit_reply.id, vm.reply_content)
          .then(function(result) {
            closeReplyModal();
            var idx = vm.replies.indexOf(vm.current_edit_reply);
            vm.replies[idx].body_html = result.reply.body_html;
            vm.current_edit_reply = null;
            vm.reply_content = '';
          });
      } else {
        TopicService.createReply($stateParams.topic_id, vm.reply_content)
          .then(function(result) {
            closeReplyModal();
            vm.replies.push(result.reply);
            vm.reply_content = "";
          }).catch(function(err) {
            BaseService.alert('提交回复', '', '提交失败！');
          })
        }
    }

    function loadMore() {
      vm.current_page++;
      var offset = ((vm.current_page || 0) - 1) * 20;
      return TopicService.getRepliesByTopic($stateParams.topic_id, offset)
        .then(function(result) {
          vm.has_more = result.replies && result.replies.length > 0;
          if (!vm.has_more) {
            vm.current_page--;
          } else {
            vm.replies = _.union(vm.replies, result.replies);
            vm.user_liked_reply_ids =  _.union(vm.user_liked_reply_ids, result.meta.user_liked_reply_ids);
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
