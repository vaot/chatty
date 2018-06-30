let app = angular.module('chatty');

app.directive('sidebar', [
  () => {
    return {
      controller: [
        '$scope',
        '$http',
        ($scope, $http) => {
          let controller = {};

          controller.signOut = () => {
            $http({
              url: '/signout',
              method: 'get'
            }).then(() => {
              window.location.replace('/');
            })
          }

          return controller;
        }
      ],
      controllerAs: 'sidebarCtrl',
      templateUrl: '/sidebar_index.html'
    }
  }
])
