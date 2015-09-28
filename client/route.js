angular.module("easypoll").run(["$rootScope", "$state", function($rootScope, $state) {
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {

        if (error === "AUTH_REQUIRED") {
            $state.go("login");
        }

    });
}]);


angular.module('easypoll').config(['$urlRouterProvider', '$stateProvider', '$locationProvider','NotificationProvider',
    function ($urlRouterProvider, $stateProvider, $locationProvider,NotificationProvider) {

        $locationProvider.html5Mode(true);

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'client/easypoll/views/login/login.ng.html',
                controller: 'LoginCtrl'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'client/easypoll/views/login/register.ng.html',
                controller: 'RegisterCtrl'
            })
            .state('question', {
                url: '/question/:id',
                templateUrl: 'client/easypoll/views/questions/question.ng.html',
                controller: 'QuestionCtrl',
                resolve: {
                    "currentUser": ["$meteor", function ($meteor) {
                        return $meteor.requireUser();
                    }]
                }
            })
            .state('questionList', {
                url: '/questions',
                templateUrl: 'client/easypoll/views/questions/questionList.ng.html',
                controller: 'QuestionListCtrl',
                resolve: {
                    "currentUser": ["$meteor", function ($meteor) {
                        return $meteor.requireUser();
                    }]
                }
            });

        $urlRouterProvider.otherwise("/questions");

        NotificationProvider.setOptions({
            delay: 2000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'center',
            positionY: 'top'
        });
    }]);


