(function() {
  'use strict';

  angular
    .module('app.service')
    .factory('BaseService', BaseService);

  ////////////////////////////////////////////////////////////

  /* @ngInject */
  function BaseService($q, $http, $ionicLoading, $ionicPopup,
    $ionicModal, $ionicActionSheet) {
    
    var modals = [];
    var service = {
      // 弹出框
      alert: alert,
      confirm: confirm,
      // 加载动画
      showLoading: showLoading,
      hideLoading: hideLoading,
      // 模态框
      registModal: registModal,
      showModal: showModal,
      hideModal: hideModal,
      recycleModals: recycleModals,
      recycleModalById: recycleModalById,
      reserveModalById: reserveModalById,
      // ActionSheet
      showActionSheet: showActionSheet,
    };

    return service;

    //////////////////////////////////////////////////////////////////////

    // 弹出警告框
    function alert(title, subTitle, message) {
      return $ionicPopup.alert({
        title: title,
        subTitle: subTitle,
        template: '<p class="text-center"><b class="assertive">' + message + '</b></p>',
        okText: '知道了'
      });
    }

    // 弹出确认框
    function confirm(title, subTitle, message) {
      return $ionicPopup.confirm({
          title: title,
          subTitle: subTitle,
          template: '<p class="text-center">' + message + '</p>',
          okText: '确认',
          cancelText: '取消'
        })
        .then(function(res) {
          return res;
        });
    }

    // 弹出加载界面
    // 可传入Spinner类型和消息
    function showLoading(style, message) {
      return $ionicLoading.show({
        template: '<ion-spinner icon="' + style +
          '" class="spinner-light"></ion-spinner><p class="text">' +
          message + '</p>'
      });
    }

    // 结束加载动画
    function hideLoading() {
      $ionicLoading.hide();
    }

    // 注册模态框
    function registModal(template_url, modal_id, scope, opts) {
      var defaults = {
        scope: scope,
        animation: 'slide-in-up'
      };
      var options = _.merge(defaults, opts);
      return $ionicModal.fromTemplateUrl(template_url, options)
        .then(function(modal) {
          if (_.indexOf(_.pluck(modals, "id"), modal_id) === -1) {
            modals.push({
              id: modal_id,
              modal: modal
            });
            return modals;
          }
        });
    }

    // 弹出模态框
    function showModal(modal_id) {
      var modal = _.find(modals, "id", modal_id).modal;
      return modal.show();
    }

    // 隐藏模态框
    function hideModal(modal_id) {
      var modal = _.find(modals, "id", modal_id).modal;
      return modal.hide();
    }

    // 回收所有模态框
    function recycleModals() {
      _.forEach(modals, function(modal) {
        modal.modal.remove();
      });
      modals = [];
    }

    // 回收某个模态框
    function recycleModalById(modal_id) {
      var modal = _.find(modals, "id", modal_id).modal;
      modal.remove();
      modals = _.reject(modals, "id", modal_id);
    }

    // 保留某个模态框
    function reserveModalById(modal_id) {
      var modal = _.find(modals, "id", modal_id).modal;
      _.forEach(modals, function(m) {
        if (modal.id !== m.modal.id) {
          m.modal.remove();
        }
      });
      modals = _.select(modals, "id", modal_id);
    }

    // 弹出 ActionSheet
    function showActionSheet(buttons, titleText, cancelText, buttonsCb, destructiveText, destructiveCb) {
      var options = {
        buttons: buttons,
        titleText: titleText,
        cancelText: cancelText,
        buttonClicked: buttonsCb,
        destructiveText: destructiveText,
        destructiveButtonClicked: destructiveCb
      };
      return $ionicActionSheet.show(options);
    }
  }

})();
