angular.module("easypoll").controller("QuestionViewCtrl", ['$scope', '$stateParams', '$meteor','$location',
    function ($scope, $stateParams,$meteor,$location) {

        $meteor.subscribe('Questions');

        $scope.questionId = $stateParams.questionId;
        $scope.respondentId = $stateParams.respondentId;
        $scope.answerId = $stateParams.answerId;

        $scope.question = $meteor.object(Questions, $stateParams.questionId, false);

        ///* Chart options */
        //$scope.options = { /* JSON data */ };
        ///* Chart data */
        //$scope.data = { /* JSON data */ }

        $scope.vote = function(id) {
            _.each($scope.question.answers, function(answer) {
                answer.selected=false;
            });
            var selAnswer = _.findWhere($scope.question.answers, {_id: id})
            selAnswer.selected=true;

            var curRespondent = _.findWhere($scope.question.respondents, {_id: $scope.respondentId});

            if (!curRespondent.answers) {
                curRespondent["answers"] = [];
            }
            curRespondent.answers.length=0;
            curRespondent.answers.push(selAnswer);
        }
    }]
);

