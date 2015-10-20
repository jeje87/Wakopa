angular.module("easypoll").controller("QuestionViewCtrl", ['$scope', '$stateParams', '$meteor','$location',
    function ($scope, $stateParams,$meteor,$location) {

        $meteor.subscribe('Questions');

        $scope.questionId = $stateParams.questionId;
        $scope.respondentId = $stateParams.respondentId;
        $scope.answerId = $stateParams.answerId;

        $scope.question = $meteor.object(Questions, $stateParams.questionId, false);
        //Session.set('question',$scope.question);

        $scope.options = {
            chart: {
                type: 'pieChart',
                height: 400,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                transitionDuration: 500,
                labelThreshold: 0.01,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        Tracker.autorun(function() {
            //alert(Session.get('question'));
        });

        //var calcAnswers = [];
        //_.each($scope.question.answers, function(answer) {
        //    calcAnswers.push({
        //        key: answer.label,
        //        y: 5
        //    });
        //});
        //
        $scope.data = [
            {
                key: "Yes",
                y: 5
            },
            {
                key: "No",
                y: 2
            }
        ];



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

