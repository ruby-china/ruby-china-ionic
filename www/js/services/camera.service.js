(function() {
  'use strict';

  angular
    .module('app.service')
    .factory('CameraService', CameraService);

  //////////////////////////////////////////////////////////////////////

  /* @ngInject */
  function CameraService($q) {
    var service = {
      getPicture: getPicture
    };

    return service;

    //////////////////////////////////////////////////////////////////////

    // 获取照片
    function getPicture(source, size, type) {
      var q = $q.defer();
      var options = {
        quality: 75,
        destinationType: type,
        sourceType: source,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: size.width,
        targetHeight: size.height,
        popoverOptions: CameraPopoverOptions, /* jshint ignore:line */
        saveToPhotoAlbum: false,
        correctOrientation: false
      };

      navigator.camera.getPicture(function(imageData) {
        q.resolve("data:image/jpeg;base64," + imageData);
      }, function(err) {
        q.reject("'----- Failed because: ' + message");
      }, options);

      return q.promise;
    }
  }
})();
