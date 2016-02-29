(function() {
  'use strict';

  angular
    .module('app.filter')
    .filter('externalLinks', externalLinks);

  /* @ngInject */
  function externalLinks($sce) {
    return function(text) {
      // 说明：由于删除 jQuery 的缘故，不再使用 BaseService.formatTopicBody 方法调整链接
      var exlinks = /href="((http|https):\/\/[\S]+)"/gi,
        atuser_links = /href="(\/[\S]+)"/gi,
        atfloor_links = /href="(#reply[0-9]+)"/gi,
        output = "";

      if (text.match(exlinks)) {
        output = $sce.trustAsHtml(
          text.replace(exlinks, "onClick=\"openUrl('$1')\"")
        );
      } else if (text.match(atuser_links)) {
        output = $sce.trustAsHtml(
          text.replace(atuser_links, "href=\"#/app/user$1\"")
        );
      } else if (text.match(atfloor_links)) {
        output = $sce.trustAsHtml(
          text.replace(atfloor_links, "")
        );
      } else {
        return text;
      }
      // console.debug(output.toString());
      return output;
    }
  }
})();
