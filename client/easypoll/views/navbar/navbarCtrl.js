angular.module('easypoll')

    .controller('navbarCtrl', function ($scope, $state) {


            $scope.brand = "<span class='glyphicon glyphicon-question-sign'></span> EasyPoll";

            $scope.buttons = [];
            $scope.leftbuttons = [];

            $scope.navfn = function (action) {
                switch (action) {
                    case 'signOut':
                        Meteor.logout(function (err) {
                            if (!err) {
                                $scope.$emit('logout');
                                $state.go("login");
                            }
                        });
                        break;
                    case 'signIn':
                        $state.go("login");
                        break;
                    case 'back':
                        $scope.$emit('questionList');
                        $state.go("questionList");
                        break;
                    default:
                        break;
                }
                ;
            };

            $scope.$on('$locationChangeStart', function(event) {
//TODO
            });

            $scope.$on('logout', function (event) {
                $scope.buttons.length = 0;
                $scope.buttons.push(
                    {
                        title: "Sign-in",
                        action: "signIn",
                        spanClass: "glyphicon glyphicon-log-in",
                        buttonClass: "btn btn-primary navbar-button"
                    }
                );
                $scope.username = "";
            });

            $scope.$on('login', function (event) {
                $scope.buttons.length = 0;
                $scope.buttons.push(
                    {
                        title: Meteor.user().profile.name.split(" ")[0],
                        action: "signOut",
                        spanClass: "glyphicon glyphicon-log-out",
                        buttonClass: " btn btn-default navbar-button"
                    }
                );
                $scope.leftbuttons.push(
                    {
                        title: "",
                        action: "back",
                        spanClass: "glyphicon glyphicon-arrow-left",
                        buttonClass: " btn btn-default navbar-button"
                    }
                );

            });


            if (Meteor.userId()) {
                $scope.$emit('login');
            }
            else {
                $scope.$emit('logout');
            }

        }
    );

