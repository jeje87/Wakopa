angular.module("easypoll").run(["$rootScope", "$state", function($rootScope, $state) {
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {

        if (error === "AUTH_REQUIRED") {
            $state.go("login");
        }
        else if (error.error === 401) {
            $state.go("401");
        }
        else {
            $state.go("error");
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
            .state('questionView', {
                url: '/question/view/:questionId/:respondentId/:answerId',
                templateUrl: 'client/easypoll/views/questions/questionView.ng.html',
                controller: 'QuestionViewCtrl',
                resolve: {
                    "isAuthorized": ["$stateParams","$meteor", function ($stateParams,$meteor) {
                        return $meteor.call('isAuthorized',  $stateParams.questionId, $stateParams.respondentId, $stateParams.answerId)
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
            })
            .state('401', {
                url: '/401',
                templateUrl: 'client/easypoll/views/common/401.ng.html',
                controller: '401Ctrl'
            })
            .state('error', {
                url: '/error',
                templateUrl: 'client/easypoll/views/common/error.ng.html',
                controller: 'ErrorCtrl'
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


