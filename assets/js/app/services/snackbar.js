let app = angular.module('chatty')

app.service('Snackbar', [
  () => {
    let api = {}

    api.display = (message) => {
      angular.element("#errors-snackbar")[0].MaterialSnackbar.showSnackbar({
        message: message,
        timeout: 3000
      })
    }

    return api
  }
])
