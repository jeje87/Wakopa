angular.module('easypoll')

    .directive('questionList',function(){
        return {
            restrict : 'E',
            scope : {},
            templateUrl : 'client/easypoll/views/questions/directives/questionList/questionList.html',
            controller: function($scope) {

                if(!Session.get('questionListlimit')) {
                    Session.set('questionListlimit', 10);
                }

                var handle = $scope.subscribe('QuestionsUser' ,() => {
                    return [ Session.get('questionListlimit') ];
                });

                $scope.$on('$destroy', function() {
                    handle.stop();
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