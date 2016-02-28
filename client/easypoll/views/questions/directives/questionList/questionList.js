angular.module('easypoll')

    .directive('questionList',function(){
        return {
            restrict : 'E',
            scope : {},
            templateUrl : 'client/easypoll/views/questions/directives/questionList/questionList.html',
            controller: function($scope, $stateParams, $meteor, $location, $reactive) {

                $scope.perPage = 10;
                $scope.nbQuestionTot = 1;

                if(!Session.get('limit')) {
                    Session.set('limit', 10);
                }

                var handle = $scope.subscribe('Questions' ,() => {
                    return [ Session.get('limit') ];
                });

                $scope.$on('$destroy', function() {
                    handle.stop();
                });

                $scope.helpers({
                    questions: () => {
                         return Questions.find({}); //, {limit: $scope.getReactively("perPage")}
                    }
                });

                $scope.loadMore = () => {
                    Session.set('limit', parseInt(Session.get('limit')) + 5);
                };

                //$scope.$watch($scope.questions, function() {$scope.questions2=$scope.questions;});
            }
        };
    });