angular.module('easypoll')

    .directive('questionList',function(){
        return {
            restrict : 'E',
            scope : {},
            templateUrl : 'client/easypoll/views/questions/directives/questionList/questionList.html',
            controller: function($scope, meteorService) {

                if(!Session.get('questionListlimit')) {
                    Session.set('questionListlimit', 10);
                }

                Tracker.autorun(function () {
                    meteorService.subscribe("QuestionsUser",Session.get('questionListlimit'));
                });

                $scope.helpers({
                    questions: () => {
                         return Questions.findFromPublication("QuestionsUser",{},{sort: {createDate: -1}});
                    }
                });

                $scope.loadMore = () => {
                    Session.set('questionListlimit', parseInt(Session.get('questionListlimit')) + 5);
                };

            }
        };
    });