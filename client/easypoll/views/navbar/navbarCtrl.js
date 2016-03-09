angular.module('easypoll')

    .controller('navbarCtrl', function ($scope, $state, $location) {


            $scope.brand = "<span class='glyphicon glyphicon-question-sign'></span> EasyPoll";

            $scope.buttons = [];
            $scope.leftbuttons = [];

            $scope.navfn = function (action) {
                switch (action) {
                    case 'signOut':
                        Meteor.logout(function (err) {
                            if (!err) {
                                $state.go("login");
                            }
                        });
                        break;
                    case 'signIn':
                        $state.go("login");
                        break;
                    case 'back':
                        $state.go("questionList");
                        break;
                    default:
                        break;
                }
            };

            let manageButtons = (next) => {
                if (Meteor.user() !== undefined) {
                    if (Meteor.user()) {
                        $scope.buttons.length = 0;
                        $scope.leftbuttons.length = 0;
                        //Meteor.user().profile.name.split(" ")[0]
                        $scope.buttons.push(
                            {
                                title: "Sign-out",
                                action: "signOut",
                                spanClass: "glyphicon glyphicon-log-out",
                                buttonClass: " btn btn-default navbar-button"
                            }
                        );
                        if (next.endsWith("questions")) {
                            $scope.leftbuttons.push(
                                {
                                    title: "",
                                    action: "back",
                                    spanClass: "glyphicon glyphicon-arrow-left",
                                    buttonClass: " btn btn-default navbar-button disabled"
                                }
                            );
                        }
                        else {
                            $scope.leftbuttons.push(
                                {
                                    title: "",
                                    action: "back",
                                    spanClass: "glyphicon glyphicon-arrow-left",
                                    buttonClass: " btn btn-default navbar-button"
                                }
                            );
                        }
                    }
                    else {
                        $scope.buttons.length = 0;
                        $scope.leftbuttons.length = 0;
                        if (!next.endsWith("login")) {
                            $scope.buttons.push(
                                {
                                    title: "Sign-in",
                                    action: "signIn",
                                    spanClass: "glyphicon glyphicon-log-in",
                                    buttonClass: "btn btn-primary navbar-button"
                                }
                            );
                        }
                    }
                }
                else {
                    console.log("waiting Meteor.user()");
                }
            };

            Tracker.autorun(function () {
                manageButtons($location.absUrl().split('?')[0]);
            });

            $scope.$on('$locationChangeSuccess', function (event, next, current) {
                manageButtons(next);
            });

        }
    );

