angular.module("easypoll").controller("QuestionListCtrl", function ($scope, $stateParams, $meteor, $location, $reactive) {

        //$reactive(this).attach($scope);
        $scope.add = function () {
            $location.path("/question/new");
        };


    }
);

