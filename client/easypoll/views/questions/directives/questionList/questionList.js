angular.module('easypoll')

    .directive('questionList',function(){
        return {
            restrict : 'E',
            scope : {},
            templateUrl : 'client/easypoll/views/questions/directives/questionList/questionList.html',
            controller: function($scope, meteorService) {

                let stateKey = "questionListState";

                Session.setDefault(stateKey, {limit :5});

                Tracker.autorun(function () {
                    meteorService.subscribe("QuestionsUser",Session.get(stateKey).limit);
                });

                $scope.helpers({
                    questions: () => {
                        return Questions.findFromPublication("QuestionsUser",{},{sort: {createDate: -1}});
                    }
                });

                $scope.loadMore = () => {
                    let state = Session.get(stateKey);
                    state.limit += 5;
                    Session.set(stateKey, state);
                };

                $scope.loadLess = () => {
                    let state = Session.get(stateKey);
                    state.limit -= 5;
                    if (state.limit<5) {
                        state.limit=5;
                    }
                    Session.set(stateKey, state);
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