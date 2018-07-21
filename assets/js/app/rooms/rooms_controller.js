const app = angular.module('chatty');

// app.controller('RoomsCtrl', [
//   '$scope',
//   ($scope) => {
//     console.log($scope, "controller");
//   }

// ])

app.controller('RoomsCtrl', function($scope) {

	console.log($scope, "controller");
	$scope.channelName = "enter your channel";
});