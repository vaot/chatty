let app = angular.module('chatty')

app.directive('panel', [
  'RoomManager',
  (RoomManager) => {

    const ENTER_KEY_CODE = 13;

    return {
      controller: [
        '$scope',
        ($scope) => {
          let controller = {}

          controller.composerHandlers = {}

          controller.composerHandlers.keypress = (event, ctrl) => {
            if (event.keyCode == ENTER_KEY_CODE) {
              event.preventDefault()
              controller.sendMessage(ctrl.getText())
              ctrl.setText("")
              $scope.message = ""
            }
          }

          controller.registerComposer = (composerCtrl) => {
            controller.composer = composerCtrl
          }

          controller.sendMessage = (message) => {
            if (!message) {
              return
            }

            RoomManager.send(message)
            $scope.message = null
          }

          controller.handleEvent = (eventType, event, editor) => {
            controller.composerHandlers[eventType](event, editor)
          }

          controller.setup = () => {
            $scope.messages = []
            $scope.attr = {}
            $scope.attr.userId = RoomManager.getCurrentUserId()


            RoomManager.on('message', (payload) => {
              if ($scope.room.encrypted) {
                $scope.$apply(() => {
                  $scope.messages.push(payload)
                })
              } else {
                $scope.messages.push(payload)
              }
            })
          }

          controller.setup()
          return controller
        }
      ],
      controllerAs: 'panelCtrl',
      templateUrl: '/panel_index.html'
    }
  }
])
