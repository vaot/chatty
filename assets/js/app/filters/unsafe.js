const app = angular.module('chatty');

app.filter('unsafe', [
  '$sce',
  ($sce) => {
    let filter = (input) => {
      return $sce.trustAsHtml(input)
    }
    return filter
  }
])
