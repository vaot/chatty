let app = angular.module('chatty')

import * as linkify from 'linkifyjs'
import linkifyHtml from 'linkifyjs/html'

app.directive('panel', [
  'RoomManager',
  'Snackbar',
  'EscapeService',
  (RoomManager, Snackbar, EscapeService) => {

    const ENTER_KEY_CODE = 13;

    return {
      controller: [
        '$scope',
        ($scope) => {
          const MAX_FILE_SIZE = 2000

          let controller = {}

          let _scrollToBottom = () => {
            let $el = jQuery(".chat-history")
            $el.scrollTop($el[0].scrollHeight)
          }

          let _onAttachmentChange = function() {
            $scope.$apply(() => {
              $scope.isFiledSelected = true
            })
          }

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

          controller.sendFile = () => {
            let el = angular.element("#attachment")[0]
            let file = el.files[0]
            let size = file.size/1024
            let reader = new FileReader()

            if(size > MAX_FILE_SIZE) {
              Snackbar.display("File selected is too big, it must be ~2MB")
              $scope.isFiledSelected = false
              return
            }

            reader.onloadend = function(event) {
              let contents = event.target.result
              let error    = event.target.error

              if (error != null) {
                console.error(error)
                return
              }

              RoomManager.sendFile(contents, file, (idx, total) => {
                let $el = angular.element('#progress-file')
                $el.show()
                $el[0].MaterialProgress.setProgress(((idx+1)/total)*100)

                if ((idx + 1) == total) {
                  setTimeout(() => {
                    $el.hide()
                    $el[0].MaterialProgress.setProgress(0)
                  }, 500)

                  $scope.isFiledSelected = false
                }
              })
            }

            reader.readAsArrayBuffer(file)
          }

          controller.sendMessage = (message) => {
            if (!message) {
              return
            }

            RoomManager.send(
              EscapeService.escape(message)
            )
            $scope.message = null
          }

          controller.handleEvent = (eventType, event, editor) => {
            controller.composerHandlers[eventType](event, editor)
          }

          controller.getUser = (userId) => {
            return RoomManager.getUser(userId)
          }

          controller.canSendFile = () => {
            return $scope.isFiledSelected
          }

          controller.setup = () => {
            $scope.messages = []
            $scope.currentUser = RoomManager.getCurrentUser()
            // We need to use jQuery here, angular does not support
            // model changes on file input. :(
            jQuery("#attachment").on('change', _onAttachmentChange)

            RoomManager.on('file', (payload) => {
              if ($scope.room.encrypted) {
                $scope.$apply(() => {
                  $scope.messages.push(payload)
                })
              } else {
                $scope.messages.push(payload)
              }
              setTimeout(_scrollToBottom, 0)

              if (payload["user_id"] == $scope.currentUser.user_id) {
                Snackbar.display("Yeahhh, the file was sent.")
              }
            })

            RoomManager.on('message', (payload) => {
              payload["message"] = linkifyHtml(payload["message"])

              if ($scope.room.encrypted) {
                $scope.$apply(() => {
                  $scope.messages.push(payload)
                })
              } else {
                $scope.messages.push(payload)
              }
              setTimeout(_scrollToBottom, 0)
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
