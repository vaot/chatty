const app = angular.module('chatty');

app.filter('timeElapsed', [
  (type) => {
    let filter = (input, type) => {
      let date = null;

      switch(type) {
        case "from_unix":
          date = moment.unix(input).fromNow();
          break;
        default:
          date = moment(new Date(input)).fromNow();
      }

      return date
    }
    return filter;
  }
])
