let app = angular.module('chatty');

app.directive('userList', [
  'RoomManager',
  (RoomManager) => {
    return {
      controller: [
        '$scope',
        ($scope) => {
          let controller = {};

          controller.setup = () => {
            $scope.activeUsers = RoomManager.getActiveUsers();

            RoomManager.on('presence', (state) => {
              $scope.$apply(()=> {
                $scope.activeUsers = state;
              });
            });
          }

          controller.addFriend = (user) => {
            console.log(user);
            RoomManager.sendFriend(user);
          }

          controller.setup();
          return controller;
        }
      ],
      templateUrl: '/user_lists_index.html',
      controllerAs: 'userCtrl'
    }
  }
])
