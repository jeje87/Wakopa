angular.module('easypoll')

    .directive('answersList',function(){
        return {
            restrict : 'E',
            scope : {},
            templateUrl : 'client/easypoll/views/questions/directives/answersList/answersList.html',
            controller: function($scope, $stateParams, $meteor, $location, $reactive) {

                $scope.perPage = 10;
                $scope.page = 1;

                var handle = Meteor.subscribe('AnswersUser');

                $scope.$on('$destroy', function() {
                    handle.stop();
                });

                //$scope.helpers({
                //    questions: () => {
                //        return Questions.findFromPublication("AnswersUser", {}, {limit: 10, sort: {createDate: -1}});
                //    }
                //});

                $scope.loadMore = () => {
                    $scope.page  += 1;
                };
            }
        };
    });

