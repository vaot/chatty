const app = angular.module('chatty');

import {Socket} from "phoenix"

app.controller('RoomsChatCtrl', [
  '$scope',
  '$stateParams',
  'RoomManager',
  'room',
  ($scope, $stateParams, RoomManager, room) => {

    let socket = new Socket("/socket", {
      params: {
        user_token: window.Chatty.userToken
      }
    })

    let controller = {}

    controller.setReady = () => {
      $scope.room.ready = true;
    }

    controller.setup = (() => {
      $scope.room = room;
      $scope.room.ready = false;
      socket.connect()
    })()

    let channel = socket.channel(`room:${$stateParams.roomId}`);
    channel.
      join().
      receive("ok", resp => { console.log("Joined successfully", resp) }).
      receive("error", resp => { console.log("Unabledsds to join", resp) });

    RoomManager.init(channel).then(() => {
      $scope.room.ready = true;
    });
  }
])
