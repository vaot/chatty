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

          let DEFAULT_THEME_COLOR = "#39446e";
          let previousColor = $scope.room.color;  

          let controller = {};

          controller.setup = () => {

            $scope.roomEncrypted = $scope.room.encrypted
            $scope.activeUsers = RoomManager.getActiveUsers()
            RoomManager.on('presence', (state) => {
              $scope.$apply(()=> {
                $scope.activeUsers = state
              })
            })

            controller.setSpectrum()
          }

          controller.setSpectrum = () => {
            // Use timeout to push call to end of the rendering stack
            setTimeout(() => {
              $("#colorPicker").spectrum({
                showPaletteOnly: true,
                showPalette: true,
                hideAfterPaletteSelect:true,
                color: $scope.room.color || DEFAULT_THEME_COLOR,
                palette: [
                  ['#0084FF', '#44BFC7', '#FFC303', '#F93D4C', '#A795C9'],
                  ['#D696BB', '#669ACC', '#12CF13', '#FF7E2A', '#E88486'],
                  ['#39446e', '#7646FE', '#20CDF7', '#67B869', '#D4A88D'],
                  ['#FF5CA1', 'black'],
                ]
              })
            })
          }

          controller.onSetRoomColor = (room) => {
            console.log(room)

            let roomAttr = {
              room_id: $scope.room.roomId,
              color: room.color
            }

            RoomsResource.save(roomAttr)
          }

          controller.onSetEncryption = (encrypted) => {
            let room = {
              encrypted: encrypted,
              room_id: $scope.room.roomId
            }

            RoomsResource.save(room).$promise.then((room) => {
              RoomManager.onEncryptedChange($scope, room)
            }, () => {
              $scope.roomEncrypted = false
            })

            
            controller.onSetThemeColor(encrypted, previousColor)
            controller.setSpectrum()

          }

          controller.onSetThemeColor = (encrypted, previousColor) => {

            if (encrypted) {
              console.log("change to black theme")
              $scope.userListColor = "#2D3037"
              $scope.room.color = "black"
              $scope.chatPanelColor = "#363940"
              $scope.messageBoxColor = "#494C55"
              $scope.frameColor = "white"
              $scope.searchBarColor = "#C4C4C4"


            } else {
              $scope.userListColor = "white"
              $scope.room.color = previousColor;
              $scope.chatPanelColor = "#F8F8FF"
              $scope.messageBoxColor = "#F8F8FF"
              $scope.frameColor = "black"
              $scope.searchBarColor = "#C4C4C4"
            }
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
