angular.module("easypoll").controller("QuestionViewCtrl", ['$scope', '$stateParams', '$meteor','$location',
    function ($scope, $stateParams,$meteor,$location) {

        $meteor.subscribe('Questions');

        $scope.questionId = $stateParams.questionId;
        $scope.respondentId = $stateParams.respondentId;
        $scope.answerId = $stateParams.answerId;

        $scope.question = $meteor.object(Questions, $stateParams.questionId, false);

    }]
);

