
var loginApp = angular.module("Login", []);

loginApp.controller("SignInCtrl", function($scope, $http)	{
	
	$scope.invalidLogInMsg = "";
	
	$scope.logIn = function()	{
		$http.post("/signIn",{
			'username': $scope.username,
			'password': $scope.password
		}).then(function(response)	{
			//checking the response data for statusCode
			if (response.data.invalidUser) {
				$scope.invalidLogInMsg = response.data.invalidLogInMsg;
			}
			else	{
				//Making a get call to the '/homePage' API
				window.location.assign('/homePage'); 				
			}
		}, function(err)	{
			$scope.invalidLogInMsg = "";
		});
	};
});

loginApp.controller("SignUpCtrl",function($scope, $http)	{
	
	$scope.existingUser = "";
	$scope.sucessfullSignUpMsg = "";
	$scope.isSignUpSuceess = false;
	$scope.unExpectedError = "";
	
	$scope.months = {
			'curValue':'January',
			'values': ['January', 'Febrauary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	};
	
	var alldates = [];
	for(var i=0;i<31;i++){
		alldates.push(i.toString());
	}
	
	$scope.days = {
			'curValue':'1',
			'allDates':alldates
	};

	var range = [];
	for(var year=1980;year<2011;year++){
		range.push(year.toString());
	}

	$scope.years = {
			'curValue':'1980',
			'birthRange':range
	};

	$scope.signUp = function()	{
		$http.post("/signUp",{
			'firstname':$scope.firstName,
			'lastname':$scope.lastName,
			'username': $scope.username,
			'password': $scope.password,
			'month':$scope.months.curValue,
			'year':$scope.years.curValue,
			'day':$scope.days.curValue,
			'gender':$scope.gender
		}).then(function(response)	{
			//checking the response data for statusCode
			if (response.data.userExists) {
				$scope.existingUser = response.data.existingUser;
			}
			else	{
				//Making a get call to the '/homePage' API
				$scope.sucessfullSignUpMsg = response.data.sucessfullSignUpMsg;
				$scope.isSignUpSuceess = true;
			}
		}, function(err)	{
			$scope.unExpectedError = "";
		});
	};
});