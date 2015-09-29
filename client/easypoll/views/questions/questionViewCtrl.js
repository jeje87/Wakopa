angular.module("easypoll").controller("QuestionViewCtrl", ['$scope', '$stateParams', '$meteor','$location',
    function ($scope, $stateParams,$meteor,$location) {

        $scope.questionId = $stateParams.questionId;
        $scope.respondentId = $stateParams.respondentId;
        $scope.answerId = $stateParams.answerId;

        //Meteor.call('isAuthorized',  $stateParams.questionId, $stateParams.respondentId, $stateParams.answerId,function(err,id) {
        //
        //    if(err){
        //        Notification.error('An error has occurred');
        //        console.log(err);
        //        return;
        //    }
        //    console.log(id);
        //
        //});

    }]
);

