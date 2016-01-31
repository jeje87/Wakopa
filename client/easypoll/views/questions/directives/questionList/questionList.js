angular.module('easypoll')

    .directive('questionList',function(){
        return {
            restrict : 'E',
            scope : {},
            templateUrl : 'client/easypoll/views/questions/directives/questionList/questionList.html',
            controller: function($scope, $stateParams, $meteor, $location, $reactive) {

                $scope.perPage = 10;
                $scope.page = 1;
                $scope.nbQuestionTot = 1;

                $scope.helpers({
                    questions: () => {
                        return Questions.find({"userId":Meteor.userId()}, {limit: parseInt($scope.getReactively("perPage")),
                            skip: parseInt((parseInt($scope.getReactively("page") - 1)) * parseInt($scope.getReactively("perPage"))),
                            sort: {createDate: -1}});
                    }
                });

                $scope.add = function () {
                    $location.path("/question/new");
                };

                $scope.loadMore = () => {
                    $scope.page  += 1;
                };

                //$scope.$watch($scope.questions, function() {$scope.questions2=$scope.questions;});
            }
        };
    });