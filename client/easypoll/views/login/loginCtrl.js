angular.module("easypoll").controller("LoginCtrl", function ($scope, $rootScope, $stateParams, $meteor, $location, contextService) {

    let goToHome = () => {
        $scope.safeApply(function () {
            $rootScope.$broadcast('login');
            $location.path('/questions');
        });
    };

    let goToReferer = (referer) => {
        $scope.safeApply(function () {
            $rootScope.$broadcast('login');
            $location.path(referer);
        });
    };

    $scope.login = function () {
        Meteor.loginWithPassword($scope.form.email, $scope.form.password, function (err) {
            if (!err) {
                goToHome();
            }
        });
    };

    $scope.register = function () {
        $location.path('/register');
    };

    $scope.loginWithFacebook = function () {

        Meteor.loginWithFacebook({
            requestPermissions: [],
            loginStyle: "popup"
        }, function (err) {
            if (!err) {
                goToHome();
            }
        });
    };

    $scope.loginWithGoogle = function () {

        var loginStyle="popup";

        if (Meteor.isCordova) { // signIn through cordova
            loginStyle="redirect";
        }

        Meteor.loginWithGoogle({
            requestPermissions: [],
            loginStyle: loginStyle
        }, function (err) {
            if (!err) {
                if($stateParams.referer) {
                    goToReferer($stateParams.referer);
                }
                else {
                    goToHome();
                }
            }
        });

    };

    $scope.autorun(() => {
        if (Meteor.user() !== undefined) {
            if (Meteor.user()) {
                $location.path('/questions');
            }
        }
    });



});
