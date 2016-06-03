angular.module('easypoll')

    .directive('questionList',function(){
        return {
            restrict : 'E',
            scope : {},
            templateUrl : 'client/easypoll/views/questions/directives/questionList/questionList.html',
            controller: function($scope, meteorService,$interval, $location) {

                let stateKey = "questionListState";
                let splashHidden = false;

                Session.setDefault(stateKey, {limit :5, search:""});

                Tracker.autorun(function () {
                    meteorService.subscribe("QuestionsUser",Session.get(stateKey).limit, Session.get(stateKey).search,  function() {
                        // when ready
                        if (Meteor.isCordova && !splashHidden){
                            navigator.splashscreen.hide();
                            splashHidden = true;
                        }
                    });
                });

                $scope.helpers({
                    questions: () => {
                        return Questions.findFromPublication("QuestionsUser",{},{sort: {createDate: -1}});
                    }
                });

                $scope.keypress = function (keyEvent) {
                    if (keyEvent.which === 13) {
                        $scope.search();
                    }
                };

                $scope.search = function () {
                    let state = Session.get(stateKey);
                    state.search = $scope.context.search;
                    Session.set(stateKey, state);
                };

                $scope.add = function () {
                    $location.path("/question/new");
                };

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

                $scope.getDateFromNow = (timestamp) => {
                   return moment(new Date(timestamp)).fromNow();
                };

                $scope.getNumberResp = (question) => {
                    return question.respondents.length;
                };

                let interval = $interval(function() { /*pour maj la minuterie*/ }, 60000);
                $scope.$on('$destroy', function () { $interval.cancel(interval); });

            }
        };
    });