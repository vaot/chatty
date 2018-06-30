const app = angular.module('chatty');

import {Socket} from "phoenix"

app.controller('RoomsChatCtrl', [
  '$scope',
  '$stateParams',
  'RoomManager',
  ($scope, $stateParams, RoomManager) => {
    let socket = new Socket("/socket", {
      params: {
        user_token: window.Chatty.userToken
      }
    })

    socket.connect()

    let channel = socket.channel(`room:${$stateParams.roomId}`, {
      user: "victor"
    });

    channel.join().receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unabledsds to join", resp) });

    RoomManager.init(channel, "victor");
  }
])
