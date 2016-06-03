angular.module("easypoll").controller("LoginCtrl", function ($scope, $rootScope, $stateParams, $meteor, $location) {

    let goToHome = () => {
        $scope.safeApply(function () {
            $rootScope.$broadcast('login');
            $location.path('/questions');
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

        if (Meteor.isCordova) { // signIn through cordova
            Meteor.cordova_g_plus({
                cordova_g_plus: true,
                profile: ["email", "email_verified", "gender", "locale", "name", "picture"]
            }, function(error) {
                if (error) {
                    //error handling code
                    alert(error);
                }
                else
                {
                    goToHome();
                }
            });
        }
        else {
            Meteor.loginWithGoogle({
                requestPermissions: [],
                loginStyle: "popup"
            }, function (err) {
                if (!err) {
                    goToHome();
                }
            });
        }

    };

    $scope.autorun(() => {
        if (Meteor.user() !== undefined) {
            if (Meteor.user()) {
                $location.path('/questions');
            }
        }
    });



});
