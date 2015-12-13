angular.module("easypoll").controller("QuestionViewCtrl", ['$scope', '$stateParams', '$meteor','$location','Notification',
    function ($scope, $stateParams,$meteor,$location,Notification) {

        //on ne renvoit pas toutes les infos
        $meteor.subscribe('QuestionsLight');

        $scope.questionId = $stateParams.questionId;
        $scope.respondentId = $stateParams.respondentId;
        $scope.answerId = $stateParams.answerId;

        $scope.question = $meteor.object(Questions, $stateParams.questionId, false);
       // Session.set('question',$scope.question);

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

        $scope.getResults = function () {
            Meteor.call('getResults', $scope.questionId  ,function(err,data) {

                if(err){
                    Notification.Error('An error has occurred');
                    console.log(err);
                    return;
                }
                $scope.data=data;

            });
        };

        $scope.vote = function(answer) {

            _.each($scope.question.answers, function(answer) {
                answer.selected=false;
            });

            answer.selected=true;

            Meteor.call('selectedAnswer', $scope.questionId,$scope.respondentId,$scope.answerId, answer._id  ,function(err,id) {

                if(err){
                    Notification.Error('An error has occurred');
                    console.log(err);
                    return;
                }
                Notification.success('Changes saved successfully');

            });

        }

        Tracker.autorun(function () {
            $scope.getResults();
        });


    }]
);

