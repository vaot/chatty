const app = angular.module('chatty');

app.service('RoomsResource', [
  '$resource',
  ($resource) => {
    const url = '/api/v1/room/:room_id'
    return $resource(url, { room_id: "@room_id" })
  }
])

