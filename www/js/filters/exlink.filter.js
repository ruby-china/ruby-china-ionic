(function() {
  'use strict';

  angular
    .module('app.filter')
    .filter('externalLinks', externalLinks);

  function externalLinks() {
    return function(text) {
      return String(text).replace(/href=/gm, "class=\"ex-link\" href=");
    }
  }
})();
