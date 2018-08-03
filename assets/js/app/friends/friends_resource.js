const app = angular.module('chatty')

app.service('FriendsResource', [
  '$resource',
  ($resource) => {
    const url = '/api/v1/friends/:friend_id'
    return $resource(url, { friend_id: "@friend_id" },  {
      'query':  {
        method:'GET',
        isArray: false
      }
    })
  }
])

