angular.module('easypoll')

    .directive('answersList',function(){
        return {
            restrict : 'E',
            scope : {},
            templateUrl : 'client/easypoll/views/questions/directives/answersList/answersList.html',
            controller: function($scope, $stateParams, $meteor, $location, $reactive) {

                $scope.perPage = 10;
                $scope.page = 1;

                $scope.helpers({
                    answers: () => {
                        return Questions.find({}, {limit: parseInt($scope.getReactively("perPage")),
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
            }
        };
    });

