let app = angular.module('chatty');

app.config([
  '$httpProvider',
  '$locationProvider',
  ($httpProvider, $locationProvider) => {
    $locationProvider.html5Mode(true)
    $locationProvider.hashPrefix('!')

    $httpProvider.interceptors.push('AuthKeyInterceptor')
  }
]);

app.config([
  '$stateProvider',
  ($stateProvider) => {
    $stateProvider.state('rooms', {
      abstract: true,
      controller: 'RoomsCtrl',
      templateUrl: '/rooms.html'
    })
    .state('index', {
      url: '/',
      controller: [
        '$state',
        ($state) => {
          $state.go('rooms.new');
        }
      ]
    })
    .state('rooms.new', {
      url: '/rooms',
      views: {
        '': {
          controller: 'RoomsNewCtrl',
          templateUrl: '/rooms_new.html'
        }
      }
    })
    .state('rooms.chat', {
      url: '/rooms/:roomId/talk',
      views: {
        '': {
          controller: 'RoomsChatCtrl',
          templateUrl: '/rooms_chat.html'
        }
      }
    })
  }
]);
