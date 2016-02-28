angular.module('easypoll')

    .controller('navbarCtrl', function($scope,$state){


        $scope.brand = "<span class='glyphicon glyphicon-question-sign'></span> EasyPoll";

        $scope.buttons = [];

        $scope.navfn = function(action){
            switch(action){
                case 'signOut':
                    Meteor.logout(function(err) {
                        if(!err) {
                            $scope.$emit('logout');
                            $state.go("login");
                        }
                    });
                    break;
                case 'signIn':
                    $state.go("login");
                    break;
                default:
                    break;
            };
        };

        $scope.$on('logout', function (event) {
            $scope.buttons.length=0;
            $scope.buttons.push(
                {
                    title:"Sign-in",
                    action:"signIn",
                    spanClass:"glyphicon glyphicon-log-in",
                    buttonClass:"btn btn-primary navbar-button"
                }
            );
            $scope.username = "";
        });

        $scope.$on('login', function (event) {
            $scope.buttons.length=0;
            if(Meteor.user() && Meteor.user().profile) {
                $scope.username = Meteor.user().profile.name;
            }
            $scope.buttons.push(
                {
                    title:$scope.username,
                    action:"signOut",
                    spanClass:"glyphicon glyphicon-log-out",
                    buttonClass:" btn btn-default navbar-button"
                }
            );

        });


        if(Meteor.userId()){
            $scope.$emit('login');
        }
        else {
            $scope.$emit('logout');
        }

    }
    );

