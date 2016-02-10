angular.module('easypoll')

    .directive('questionList',function(){
        return {
            restrict : 'E',
            scope : {},
            templateUrl : 'client/easypoll/views/questions/directives/questionList/questionList.html',
            controller: function($scope, $stateParams, $meteor, $location, $reactive) {

                $scope.perPage = 10;
                $scope.nbQuestionTot = 1;

                var handle = $scope.subscribe('Questions');

                $scope.$on('$destroy', function() {
                    handle.stop();
                });

                $scope.helpers({
                    questions: () => {
                         return Questions.find({"userId":Meteor.userId()}, {limit: $scope.getReactively("perPage"), sort: {createDate: -1}});
                    }
                });

                $scope.loadMore = () => {
                    $scope.perPage  += 10;
                };

                //$scope.$watch($scope.questions, function() {$scope.questions2=$scope.questions;});
            }
        };
    });