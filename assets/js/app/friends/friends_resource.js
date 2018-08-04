const app = angular.module('chatty')

app.service('FriendsResource', [
  '$resource',
  ($resource) => {
    const url = '/api/v1/friends/:id'
    return $resource(url, { id: "@id" },  {
      'query':  {
        method:'GET',
        isArray: false
      }
    })
  }
])

