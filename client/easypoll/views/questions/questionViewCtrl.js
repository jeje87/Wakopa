angular.module("easypoll").controller("QuestionViewCtrl", ['$scope', '$stateParams', '$meteor','$location','Notification',
    function ($scope, $stateParams,$meteor,$location,Notification) {

        $meteor.subscribe('QuestionsLight');  //on ne renvoit pas toutes les infos

        $scope.questionId = $stateParams.questionId;
        $scope.respondentId = $stateParams.respondentId;
        $scope.answerId = $stateParams.answerId;
        $scope.question = $meteor.object(Questions, $stateParams.questionId, false);

       // Session.set('question',$scope.question);



        var getAnswerUser = function () {
            Meteor.call('getAnswerUser', $stateParams.questionId, $stateParams.respondentId, $stateParams.answerId ,function(err,data) {

                if(err){
                    Notification.Error('An error has occurred');
                    console.log(err);
                    return;
                }

                console.log( data);

                if(data) {
                    $scope.user = {};
                    $scope.user.to = data.email;
                }

            });
        };

        var getResults = function () {
            Meteor.call('getResults', $scope.questionId  ,function(err,data) {

                if(err){
                    Notification.Error('An error has occurred');
                    console.log(err);
                    return;
                }
                $scope.labels = data.labels;
                $scope.data = data.values;

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

        };


        //$scope.$watch('question', function() {
        //    console.log("changed");
        //
        //});

        var init = function () {

            getAnswerUser();

            Tracker.autorun(function () {

                getResults();
                Notification.success('Changes detected');

            });
        };

        init();




    }]
);

