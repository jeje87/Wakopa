angular.module('easypoll')

    .controller('navbarCtrl',['$scope','$state',function($scope,$state){
        //=== Variables ===//

        //$scope.affixed = 'top';
        $scope.search = {
            show : false,
            terms : ''
        };
        $scope.brand = "<span class='glyphicon glyphicon-question-sign'></span> EasyPoll";
        $scope.inverse = false;

        $scope.menus = []; // end menus
        $scope.rightmenus = []; // end menus

        $scope.item = '';
        //$scope.styling = 'Inverse';
        $scope.searchDisplay = 'Visible';

        $scope.searchfn = function(){
            alert('Attempting search on: "' + $scope.search.terms + '"');
        }; // searchfn

        $scope.navfn = function(action){
            switch(action){
                case 'signOff':
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
                    $scope.item = 'Default selection.';
                    break;
            }; // end switch
        }; // end navfn

        $scope.toggleStyling = function(){
            $scope.inverse = !$scope.inverse;
            if(angular.equals($scope.inverse,true))
                $scope.styling = 'Inverse';
            else
                $scope.styling = 'Default';
        }; // end toggleStyling

        $scope.toggleSearchForm = function(){
            $scope.search.show = !$scope.search.show;
            if(angular.equals($scope.search.show,true))
                $scope.searchDisplay = 'Visible';
            else
                $scope.searchDisplay = 'Hidden';
        }; // end toggleSearchForm

        $scope.addMenu = function(){
            $scope.menus.push({
                title : "Added On The Fly!",
                action : "default"
            });
        }; // end test

        $scope.toggleAffixed = function(){
            switch($scope.affixed){
                case 'top':
                    $scope.affixed = 'bottom';
                    break;
                case 'bottom':
                    $scope.affixed = 'none';
                    break;
                case 'none':
                    $scope.affixed = 'top';
                    break;
            };
        }; // end toggleAffixed

        $scope.$on('logout', function (event) {
            $scope.rightmenus.length=0;
            $scope.rightmenus.push(
                {
                    title : "Sign in",
                    action : "signIn"
                }
            );
        });

        $scope.$on('login', function (event) {
            $scope.rightmenus.length=0;
            $scope.rightmenus.push(
                {
                    title : "Sign off",
                    action : "signOff"
                }
            );
        });

        if(Meteor.userId()){
            $scope.$emit('login');
        }
        else {
            $scope.$emit('logout');
        }

    }]);

