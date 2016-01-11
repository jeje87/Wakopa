angular.module("easypoll").controller("LoginCtrl", function ($scope, $rootScope, $stateParams,$meteor,$location,$alert) {

        $scope.login = function() {
            Meteor.loginWithPassword($scope.form.email,$scope.form.password,function(err){
                if(!err) {
                    $rootScope.$broadcast('login');
                    $location.path('/questions');
                }
            });
        };

        $scope.register = function() {
            $location.path('/register');
        };

        $scope.loginWithFacebook = function() {

            Meteor.loginWithFacebook(function(err){
                if(!err) {
                    $rootScope.$broadcast('login');
                    $location.path('/questions');
                }
            });
        };

        $scope.loginWithGoogle = function() {

            Meteor.loginWithGoogle(function(err){
                if(!err) {
                    $rootScope.$broadcast('login');
                    $location.path('/questions');
                }
            });
        }


    }
);
