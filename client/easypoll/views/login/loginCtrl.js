angular.module("easypoll").controller("LoginCtrl", function ($scope, $rootScope, $stateParams,$meteor,$location) {

        $scope.login = function() {
            Meteor.loginWithPassword($scope.form.email,$scope.form.password,function(err){
                if(!err) {
                    $scope.safeApply(function () {
                        $rootScope.$broadcast('login');
                        $location.path('/questions');
                    });
                }
            });
        };

        $scope.register = function() {
            $location.path('/register');
        };

        $scope.loginWithFacebook = function() {

            Meteor.loginWithFacebook({
                requestPermissions: [],
                loginStyle: "popup"
            },function(err){
                if(!err) {
                    $scope.safeApply(function () {
                        $rootScope.$broadcast('login');
                        $location.path('/questions');
                    });
                }
            });
        };

        $scope.loginWithGoogle = function() {

            Meteor.loginWithGoogle({
                requestPermissions: [],
                loginStyle: "popup"
            },function(err){
                if(!err) {
                    $scope.safeApply(function () {
                        $rootScope.$broadcast('login');
                        $location.path('/questions');
                    });
                }
            });
        }


    }
);
