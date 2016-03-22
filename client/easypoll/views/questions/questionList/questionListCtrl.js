angular.module("easypoll").controller("QuestionListCtrl", function ($scope) {

        let stateKey = "QuestionListCtrlState";
        $scope.context ={};

        Session.setDefault(stateKey, {tabSelected: 0});
        $scope.tabSelected = Session.get(stateKey).tabSelected;

        $scope.keep = function (index) {
            let state = Session.get(stateKey);
            state.tabSelected = index;
            Session.set(stateKey, state);
        };

    }
);

