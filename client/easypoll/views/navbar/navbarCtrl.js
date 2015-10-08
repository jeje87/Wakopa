angular.module('easypoll')

    .controller('navbarCtrl',['$scope','$state',function($scope,$state){
        //=== Variables ===//

        $scope.brand = "<span class='glyphicon glyphicon-question-sign'></span> EasyPoll";

        $scope.menus = []; // end menus

        $scope.searchfn = function(){
            alert('Attempting search on: "' + $scope.search.terms + '"');
        }; // searchfn

        if(Meteor.userId()){
            $scope.$emit('login');
        }
        else {
            $scope.$emit('logout');
        }

    }]);

