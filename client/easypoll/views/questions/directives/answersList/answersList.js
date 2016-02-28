angular.module('easypoll')

    .directive('answersList',function(){
        return {
            restrict : 'E',
            scope : {},
            templateUrl : 'client/easypoll/views/questions/directives/answersList/answersList.html',
            controller: function($scope) {

                if(!Session.get('answersListlimit')) {
                    Session.set('answersListlimit', 10);
                }

                var handle = $scope.subscribe('AnswersUser' ,() => {
                    return [ Session.get('answersListlimit') ];
                });

                $scope.$on('$destroy', function() {
                    handle.stop();
                });

                $scope.helpers({
                    questions: () => {
                        return Questions.findFromPublication("AnswersUser", {}, {limit: 10, sort: {createDate: -1}});
                    }
                });

                $scope.loadMore = () => {
                    Session.set('answersListlimit', parseInt(Session.get('answersListlimit')) + 5);
                };
            }
        };
    });

