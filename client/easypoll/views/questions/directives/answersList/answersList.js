angular.module('easypoll')

    .directive('answersList',function(meteorService){
        return {
            restrict : 'E',
            scope : {},
            templateUrl : 'client/easypoll/views/questions/directives/answersList/answersList.html',
            controller: function($scope) {

                if(!Session.get('answersListlimit')) {
                    Session.set('answersListlimit', 5);
                }

                Tracker.autorun(function () {
                    meteorService.subscribe("AnswersUser", Session.get('answersListlimit'));
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

