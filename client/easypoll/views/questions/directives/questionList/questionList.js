angular.module('easypoll')

    .directive('questionList',function(){
        return {
            restrict : 'E',
            scope : {},
            templateUrl : 'client/easypoll/views/questions/directives/questionList/questionList.html',
            controller: function($scope, meteorService) {

                if(!Session.get('questionListlimit')) {
                    Session.set('questionListlimit', 5);
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

                $scope.getPercent = (question) => {
                    //debugger;
                    //console.log("call");
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