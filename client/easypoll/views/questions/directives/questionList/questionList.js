angular.module('easypoll')

    .directive('questionList',function(){
        return {
            restrict : 'E',
            scope : {},
            templateUrl : 'client/easypoll/views/questions/directives/questionList/questionList.html',
            controller: function($scope, meteorService, contextService) {

                $scope.context = contextService.getContext();

                if(!$scope.context.questionList) {
                    $scope.context.questionList = {};
                    $scope.context.questionList.rowNumber = 5;
                }

                //$scope.bibi="bobo";

                $scope.$on("$destroy", function(){
                    contextService.saveContext();
                });

                Tracker.autorun(function () {
                    meteorService.subscribe("QuestionsUser",$scope.getReactively("context", true).questionList.rowNumber);
                });


                $scope.helpers({
                    questions: () => {
                        return Questions.findFromPublication("QuestionsUser",{},{sort: {createDate: -1}});
                    }
                });

                $scope.loadMore = () => {
                    $scope.context.questionList.rowNumber = $scope.context.questionList.rowNumber + 5;
                };

                $scope.getAvctPercent = (question) => {
                    if(question.respondents.length>0) {
                        let nbrResp = 0;
                        for (let i = 0; i < question.respondents.length; i++) {
                            if (question.respondents[i].answers && question.respondents[i].answers.length > 0) {
                                nbrResp++;
                            }
                        }
                        return (nbrResp / question.respondents.length) * 100;
                    }
                    return 0;
                };


            }
        };
    });