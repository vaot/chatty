const app = angular.module('chatty');

app.service('RoomsResource', [
  '$resource',
  ($resource) => {
    const url = '/api/v1/room'
    return $resource(url, {})
  }
])

