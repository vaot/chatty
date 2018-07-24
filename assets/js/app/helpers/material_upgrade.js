const app = angular.module('chatty');

app.directive('materialUpgrade', [
  () => {
    return {
      link: (scope, element, attrs) => {
        setTimeout(() => {
          window.componentHandler.upgradeElements(element[0])
        }, 1000)
      }
    }
  }
])
