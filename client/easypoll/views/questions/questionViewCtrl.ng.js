angular.module("easypoll").controller("QuestionViewCtrl", function ($scope, $stateParams,$meteor,$location,Notification) {

    $scope.results = {};
    $scope.user = {};

    //renvoi la réponse de l'utilisateur connecté
    var getAnswerUser = function () {
        Meteor.call('getAnswerUser', $stateParams.questionId, $stateParams.respondentId, $stateParams.answerId ,function(err,data) {

            if(err){
                Notification.Error('An error has occurred');
                console.log(err);
                return;
            }

            if(data) {

                $scope.user.to = data.email;
                $scope.user.answers = data.answers;
            }

        });
    };

    //renvoi les résultats de la question affichée
    var getResultsClient = function () {
        Meteor.call('getResults', $stateParams.questionId  ,function(err,data) {

            if(err){
                Notification.Error('An error has occurred');
                console.log(err);
                return;
            }

            $scope.safeApply(function () {
                $scope.results.labels = data.labels;
                $scope.results.data = data.values;
            });

        });
    };

    //action du vote
    $scope.vote = function(answer) {

        $scope.user.answers.length = 0;
        $scope.user.answers.push(answer._id);

        Meteor.call('selecteAnswer', $stateParams.questionId,$stateParams.respondentId,$stateParams.answerId, answer._id  ,function(err,data) {

            if(err){
                Notification.Error('An error has occurred');
                console.log(err);
                return;
            }
            Notification.success('Changes saved successfully');

        });
    };

    $scope.selectedByMe = function(answer) {
        return _.contains($scope.user.answers, answer._id);
    };

    //Pour question de sécurité, on ne renvoit pas toutes les infos -> QuestionsView et non Questions
    $scope.subscribe('QuestionsView', () => [
    ]);

    //lie la variable $scope.question à la collection Mongo
    $scope.helpers({
        question: () => {
            return Questions.findOne($stateParams.questionId);
        }
    });

    $scope.autorun(() => {
        getResultsClient();
    });

    var init = function () {
        getAnswerUser();
    };

    init();

    //http://localhost:3000/question/view/qXmKcfyHNWpy3ZwD5/sZ2zmuKpLxwxw7vA3/Zt5PMDMGhReZ5zvBb#tabAllAnswers

    }
);

