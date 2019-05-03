var app = angular.module("app", ["ngRoute","ui.router","ngMessages","ngCookies","ngIdle"])

.config(function($stateProvider,$urlRouterProvider) {
	$urlRouterProvider.otherwise("/login");
	$stateProvider
	.state('login', {
		controller : 'loginCtrl',
		url : '/login',
		templateUrl : 'templates/login.html'
	})
	.state('dashboard', {
		controller : 'dashboardCtrl',
		url : '/dashboard',
		templateUrl : 'templates/dashboard.html'
	})
	.state('user', {
		controller : 'userCtrl',
		url : '/user',
		templateUrl : 'templates/user.html'
	})
	.state('configuration', {
		controller : 'configurationCtrl',
		url : '/configuration',
		templateUrl : 'templates/configuration.html'
	})
	.state('aboutUs', {
		//controller : 'configurationCtrl',
		url : '/aboutUs',
		templateUrl : 'templates/aboutUs.html'
	})
	.state('benfits', {
		//controller : 'configurationCtrl',
		url : '/benfits',
		templateUrl : 'templates/benefits.html'
	})
	.state('services', {
		//controller : 'configurationCtrl',
		url : '/services',
		templateUrl : 'templates/services.html'
	})
	.state('securityAnswer', {
		controller : 'securityQuestionCtrl',
		url : '/securityAnswer',
		templateUrl : 'templates/securityAnswer.html'
	})
	.state('updatePassword', {
		//controller : 'loginCtrl',
		url : '/updatePassword',
		templateUrl : 'templates/updatePassword.html'
	})
	
	/*$urlRouterProvider.otherwise(function ($injector, $location) {
	    var $state = $injector.get("$state");
	    $state.go("/");
	  });*/
})

//Session Idle
/*.run(function($rootScope,$window,$state,Idle){
	Idle.watch();
	
	----Logout User------
	$rootScope.$on('IdleTimeout', function(){
		$state.go("login");
		$window.location.reload();
	})
})
*/