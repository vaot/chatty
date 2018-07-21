let app = angular.module('chatty');

import { load, parse } from 'gh-emoji';

window.parse = parse;

app.directive('panel', [
  'RoomManager',
  (RoomManager) => {

    const ENTER_KEY_CODE = 13;

    return {
      controller: [
        '$scope',
        ($scope) => {
          let controller = {};

          controller.sendMessage = (message) => {
            if (!message) {
              return;
            }

            RoomManager.send(message);
            $scope.message = null;
          }

          controller.onKeyPress = (message, event) => {
            if (event.keyCode == ENTER_KEY_CODE) {
              controller.sendMessage(message);
              // console.log("TESTING THIS AREA");
            }
          }

          controller.onMessageChange = (message) => {
            load().then(() => {
              let pm = parse(message);
              console.log(pm);
              message = pm;
              const test = pm.replace("<img","<img draggable='false' (dragstart)='false;' class='unselectable'");
              // let first_message = message;
              // let parsed_message = parse(message);
              // console.log("first: " +first_message);
              // console.log("parsed: " +parsed_message);
              $scope.message = test.replace("<br>", "");
            });
            // console.log(message);
          }

          controller.setup = () => {
            $scope.messages = [];
            $scope.attr = {};
            $scope.attr.userId = window.parseInt(window.Chatty.userId, 10);

            RoomManager.on('message', (payload) => {
              $scope.$apply(() => {
                $scope.messages.push(payload);
              })
            })
          }

          controller.setup()
          return controller;
        }
      ],
      controllerAs: 'panelCtrl',
      templateUrl: '/panel_index.html'
    }
  }
]);

app.directive('contenteditable', () => {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: (scope, elm, attr, ngModel) => {

          let updateViewValue = (event) => {
            ngModel.$setViewValue(event.currentTarget.innerHTML);
          }
          //Binding it to keyup, lly bind it to any other events of interest 
          //like change etc..
          elm.on('keyup', updateViewValue);

          scope.$on('$destroy', () => {
            elm.off('keyup', updateViewValue);
          });

          ngModel.$render = () => {
             elm.html(ngModel.$viewValue);
          }

        }
    }
});
