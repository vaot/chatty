const app = angular.module('chatty');

app.run([
  '$templateCache',
  '$rootScope',
  ($templateCache, $rootScope) => {
    $rootScope.currentUser = {
      id: parseInt(window.Chatty.userId, 10)
    }

    angular.forEach(JST, (template, template_name) => {
      return $templateCache.put(`/${template_name}.html`, template.hamlc({}));
    })
  }
]);
