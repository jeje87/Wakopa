angular.module("easypoll").controller("QuestionViewCtrl", ['$scope', '$stateParams', '$meteor','$location','Notification',
    function ($scope, $stateParams,$meteor,$location,Notification) {

        //on ne renvoit pas toutes les infos
        $meteor.subscribe('QuestionsLight');

        $scope.questionId = $stateParams.questionId;
        $scope.respondentId = $stateParams.respondentId;
        $scope.answerId = $stateParams.answerId;
        //$scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
        //$scope.data = [300, 500, 100, 40, 120];
        $scope.question = $meteor.object(Questions, $stateParams.questionId, false);
       // Session.set('question',$scope.question);

        $scope.getAnswerUser = function () {
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

        $scope.getAnswerUser();

        $scope.getResults = function () {
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

        Tracker.autorun(function () {
            $scope.getResults();
            //Notification.success('Changes detected');
        });

        //$scope.$watch('question', function() {
        //    console.log("changed");
        //    //Notification.success('Changes detected');
        //});

    }]
);

