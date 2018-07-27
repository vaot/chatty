const app = angular.module('chatty')

app.directive('messageComposer', [
  () => {
    return {
      link: (scope, element, attrs, panelCtrl) => {
        scope.panelCtrl = panelCtrl
      },
      controller: [
        '$scope',
        '$element',
        ($scope, $element) => {

          let controller = {}

          controller.$onInit = () => {
            jQuery($element).emojioneArea({
              events: {
                keypress: (editor, event) => {
                  $scope.panelCtrl.handleEvent('keypress', event, controller)
                }
              }
            })
          }

          controller.getText = () => {
            return $element[0].emojioneArea.getText()
          }

          controller.setText = (val) => {
            return $element[0].emojioneArea.setText(val)
          }

          return controller
        }
      ],
      scope: {},
      require: "^panel",
      controllerAs: 'composerCtrl'
    }
  }
])
