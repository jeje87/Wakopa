angular.module("easypoll").run(function($rootScope, $state, $stateParams) {
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {

        if (error === "AUTH_REQUIRED") {
            $state.go("login");
        }
        else if (error === "AUTH_REQUIRED_ANSWER") {
            console.log(event);
            $state.go("login", {referer:"/answer/" + toParams.questionId});
        }
        else if (error.error === 401) {
            $state.go("401");
        }
        else {
            $state.go("error");
        }

    });
});


angular.module('easypoll').config(function ($urlRouterProvider, $stateProvider, 
                                            $locationProvider,NotificationProvider) {

        $locationProvider.html5Mode(true);

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'client/easypoll/views/login/login.html',
                controller: 'LoginCtrl',
                params: {referer: null}
            })
            .state('register', {
                url: '/register',
                templateUrl: 'client/easypoll/views/login/register.html',
                controller: 'RegisterCtrl'
            })
            .state('question', {
                url: '/question/:id',
                templateUrl: 'client/easypoll/views/questions/question/question.html',
                controller: 'QuestionCtrl',
                resolve:  {
                    "currentUser": ($meteor, $q) => {

                        var deferred = $q.defer();

                        if (Meteor.userId() == null) {
                            deferred.reject("AUTH_REQUIRED");
                        }
                        else {
                            deferred.resolve(true);
                        }

                        return deferred.promise;

                    }
                }
            })
            .state('answer', {
                url: '/answer/:answerId',
                templateUrl: 'client/easypoll/views/answer/answer.html',
                controller: 'answerCtrl',
                params: {questionId: null},
                resolve: {

                    "isAuthorized": ($q) => {

                        var deferred = $q.defer();

                        if (Meteor.userId() == null) {
                            deferred.reject("AUTH_REQUIRED_ANSWER");
                        }
                        else {
                            deferred.resolve(true);
                        }

                        return deferred.promise;

                    }
                }
            })
            .state('questionView', {
                url: '/question/view/:questionId/:respondentId/:answerId',
                templateUrl: 'client/easypoll/views/questions/questionView/questionView.html',
                controller: 'QuestionViewCtrl',
                resolve: {

                    "isAuthorized": ($q,$stateParams) => {

                        var deferred = $q.defer();

                        Meteor.call('isAuthorized', $stateParams.questionId, $stateParams.respondentId, $stateParams.answerId, function (err, data) {
                            if (err || data === false) {
                                deferred.reject(err);
                            }
                            else {
                                deferred.resolve(data);
                            }

                        });

                        return deferred.promise;

                    }
                }
            })
            .state('questionView2', {
                url: '/question/view/:questionId',
                templateUrl: 'client/easypoll/views/questions/questionView/questionView.html',
                controller: 'QuestionViewCtrl',
                resolve: {

                    "isAuthorized": ($q, $stateParams) => {

                        var deferred = $q.defer();

                        Meteor.call('isAuthorized', $stateParams.questionId, function (err, data) {
                            if (err || data === false) {
                                deferred.reject(err);
                            }
                            else {
                                deferred.resolve(data);
                            }

                        });

                        return deferred.promise;

                    }
                }
            })
            .state('questionList', {
                url: '/questions',
                templateUrl: 'client/easypoll/views/questions/questionList/questionList.html',
                controller: 'QuestionListCtrl',
                resolve: {
                    "currentUser": ($meteor, $q) => {

                        var deferred = $q.defer();

                        if (Meteor.userId() == null) {
                            deferred.reject("AUTH_REQUIRED");
                        }
                        else {
                            deferred.resolve(true);
                        }

                        return deferred.promise;

                    }
                }
            })
            .state('401', {
                url: '/401',
                templateUrl: 'client/easypoll/views/common/401.html',
                controller: '401Ctrl'
            })
            .state('error', {
                url: '/error',
                templateUrl: 'client/easypoll/views/common/error.html',
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
    }
);


