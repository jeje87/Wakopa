angular.module('easypoll')

    .directive('questionList',function(meteorService){
        return {
            restrict : 'E',
            scope : {},
            templateUrl : 'client/easypoll/views/questions/directives/questionList/questionList.html',
            controller: function($scope) {



                if(!Session.get('questionListlimit')) {
                    Session.set('questionListlimit', 10);
                }

                Tracker.autorun(function () {
                    meteorService.subscribeQuestionsUser(Session.get('questionListlimit'));
                });


                //var handle = $scope.subscribe('QuestionsUser' ,() =>
                //    [ Session.get('questionListlimit') ], {
                //        onStop: function (error) {
                //            alert('stop');
                //        }
                //    }
                //);

                //$scope.$on('$destroy', function() {
                //    handle.stop();
                //});

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