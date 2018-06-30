const app = angular.module('chatty');

app.factory('AuthKeyInterceptor', [
  () =>
    ({
      request(config) {
        const headers = {'X-Chatty-Auth-key': "replacewithactualauthkey"};

        angular.extend(config.headers, headers);
        return config;
      }
    })

]);
