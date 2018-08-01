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
    .state('rooms.index', {
      url: '/rooms',
      views: {
        '': {
          templateUrl: '/rooms_index.html',
          controller: [
            '$scope',
            'rooms',
            ($scope, rooms) => {
              $scope.rooms = rooms
            }
          ],
          resolve: {
            rooms: [
              'RoomsResource',
              (RoomsResource) => {
                return RoomsResource.query({room_id: null}).$promise.then((result) => {
                  return result.rooms
                })
              }
            ]
          },
        }
      }
    })
    .state('rooms.new', {
      url: '/rooms/new',
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
          templateUrl: '/rooms_chat.html',
          resolve: {
            room: [
              'RoomsResource',
              '$stateParams',
              'UsersCryptoManager',
              (RoomsResource, $stateParams, UsersCryptoManager) => {
                return RoomsResource.get({ room_id: $stateParams.roomId }).$promise.then((room) => {
                  UsersCryptoManager.init(room)
                  return room
                })
              }
            ]
          }
        }
      }
    })
    .state('friends', {
      url: '/friends',
      views: {
        '': {
          controller: 'FriendsController',
          templateUrl: '/friends_index.html',
          resolve: {
            friends: [
              () => {
                // TO DO: Return friends here
                return []
              }
            ]
          }
        }
      }
    })
  }
]);
