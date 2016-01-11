angular.module("easypoll").controller("QuestionListCtrl", function ($scope, $stateParams,$meteor,$location) {

        $scope.nbLine=10;
        $meteor.subscribe('Questions');

        var getQuestions = function () {
            $scope.questions = $meteor.collection(function(){
                return Questions.find({"userId":Meteor.userId()}, {limit: $scope.nbLine, sort:{createDate: -1}});
            });
        };

        $scope.add = function() {
            $location.path("/question/new");
        };

        $scope.loadMore = function() {
            $scope.nbLine+=10;
            getQuestions();
        };

        getQuestions();

    }
);

