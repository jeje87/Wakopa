angular.module("easypoll").controller("QuestionListCtrl", function ($scope, $stateParams, $meteor, $location) {

        let stateKey = "QuestionListCtrlState";

        Session.setDefault(stateKey, {tabSelected: 0});
        $scope.tabSelected = Session.get(stateKey).tabSelected;

        $scope.keep = function(index) {
            let state = Session.get(stateKey);
            state.tabSelected = index;
            Session.set(stateKey, state);
        };

        $scope.focusinControl = {};

        $scope.add = function () {
            $location.path("/question/new");
        };

    }
);

