angular.module("easypoll").controller("QuestionViewCtrl",
    function ($scope, $stateParams,$meteor,$location,Notification,meteorService,$reactive) {

    //*********************************************************************************************
    //************************************ Déclarations *******************************************
    //*********************************************************************************************

    $reactive(this).attach($scope);
    $scope.results = {};
    $scope.user = {};
    $scope.totValue = 0;

    //*********************************************************************************************
    //********************************* Méthodes privées ******************************************
    //*********************************************************************************************

    //renvoi la réponse de l'utilisateur connecté
    let getAnswerUser = function () {

        this.call('getAnswerUser', $stateParams.questionId, $stateParams.respondentId, $stateParams.answerId, function(err,data) {

            if(err){
                Notification.error('An error has occurred (getAnswerUser)');
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
    let getResultsClient = function () {

        this.call('getResults', $stateParams.questionId  ,function(err,data) {

            if(err){
                Notification.Error('An error has occurred');
                console.log(err);
                return;
            }

            $scope.totValue = data.values.reduce(function(prev, cur) {
                return prev + cur;
            });

            $scope.results.labels = data.labels;
            $scope.results.data = data.values;

        });
    };

    let init = function () {
        getAnswerUser();
    };

    //*********************************************************************************************
    //********************************* Méthodes publiques ****************************************
    //*********************************************************************************************

    //action du vote
    $scope.vote = function(answer) {

        $scope.user.answers.length = 0;
        $scope.user.answers.push(answer._id);

        this.call('selectAnswer', $stateParams.questionId, answer._id, $stateParams.respondentId, $stateParams.answerId ,function(err,data) {

            if(err){
                Notification.error('An error has occurred');
                console.log(err);
                return;
            }

            //Notification.success('Changes saved successfully');

        });
    };

    $scope.selectedByMe = function(answer) {
        return _.contains($scope.user.answers, answer._id);
    };

    this.autorun(function () {
        meteorService.subscribe("QuestionsView");
        getResultsClient();
    });

    //lie la variable $scope.question à la collection Mongo
    $scope.helpers({
        question: () => {
            return Questions.findOne($stateParams.questionId);
        }
    });

    $scope.back = () => {
        $location.path("/questionList");
    };

    //*********************************************************************************************
    //********************************** Initialisation *******************************************
    //*********************************************************************************************

    init();

    //http://localhost:3000/question/view/qXmKcfyHNWpy3ZwD5/sZ2zmuKpLxwxw7vA3/Zt5PMDMGhReZ5zvBb#tabAllAnswers

    }
);

