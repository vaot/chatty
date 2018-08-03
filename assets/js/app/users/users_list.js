let app = angular.module('chatty')

app.directive('userList', [
  'RoomManager',
  'RoomsResource',
  'FriendsResource',
  (RoomManager, RoomsResource, FriendsResource) => {
    return {
      controller: [
        '$scope',
        ($scope) => {
          let controller = {};

          controller.setup = () => {
            $scope.roomEncrypted = $scope.room.encrypted
            $scope.activeUsers = RoomManager.getActiveUsers()

            RoomManager.on('presence', (state) => {
              $scope.$apply(()=> {
                $scope.activeUsers = state
              })
            })
          }

          controller.onSetEncryption = (encrypted) => {
            let room = {
              encrypted: encrypted,
              user_id: $scope.room.user_id,
              room_id: $scope.room.roomId
            }

            RoomsResource.save(room).$promise.then((room) => {
              RoomManager.onEncryptedChange($scope, room)
            }, () => {
              $scope.roomEncrypted = false
            })
          }

          controller.addFriend = (user) => {
            FriendsResource.save({ friend_id: user.user_id }).$promise.then((result) => {
              console.log(result)
            })
          }

          controller.setup()
          return controller
        }
      ],
      templateUrl: '/user_lists_index.html',
      controllerAs: 'userCtrl'
    }
  }
])
