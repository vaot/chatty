const app = angular.module('chatty');

app.run([
  '$templateCache',
  ($templateCache) => {
    angular.forEach(JST, (template, template_name) => {
      return $templateCache.put(`/${template_name}.html`, template.hamlc({}));
    })
  }
]);
