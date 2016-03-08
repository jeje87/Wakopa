angular.module('easypoll')

    .directive('answersList',function(meteorService){
        return {
            restrict : 'E',
            scope : {},
            templateUrl : 'client/easypoll/views/questions/directives/answersList/answersList.html',
            controller: function($scope) {

                let stateKey = "answersListState";

                Session.setDefault(stateKey, {limit :5});

                Tracker.autorun(function () {
                    meteorService.subscribe("AnswersUser", Session.get(stateKey).limit);
                });

                $scope.helpers({
                    questions: () => {
                        return Questions.findFromPublication("AnswersUser", {}, {sort: {createDate: -1}});
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

            }
        };
    });

