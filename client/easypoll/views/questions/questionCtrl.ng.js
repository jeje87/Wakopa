angular.module("easypoll").controller("QuestionCtrl", function ($scope, $stateParams,$meteor,$location,Notification) {

    //*********************************************************************************************
    //************************************ Déclarations *******************************************
    //*********************************************************************************************

    $scope.allowSave=false;
    $scope.pageClass = 'page-home';
    $scope.results = {};

    $scope.typeAnswers = [
        {"_id":"1", "label":"Yes or No","values":[{"_id":Random.id(),"label":"Yes"},{"_id":Random.id(),"label":"No"}]},
        {"_id":"2", "label":"Yes, No or Maybe","values":[{"_id":Random.id(),"label":"Yes"},{"_id":Random.id(),"label":"No"},{"_id":Random.id(),"label":"Maybe"}]}
    ];

    $scope.subscribe('Questions', () => [
    ]);

    //*********************************************************************************************
    //********************************* Méthodes privées ******************************************
    //*********************************************************************************************

    let sendMail = (idRespondent) => {
        Meteor.call('sendQuestion',  angular.copy($scope.question), idRespondent ,function(err,id) {

            if(err){
                Notification.error('An error has occurred');
                console.log(err);
                return;
            }
            Notification.success('Question sended successfully');

        });
    };

    //renvoi les résultats de la question affichée
    let getResultsClient = function (questionId) {
        Meteor.call('getResults', questionId  ,function(err,data) {

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

    let init = function () {
        if($stateParams.id && $stateParams.id!=="new") {

            $scope.helpers({
                question: () => {
                    return Questions.findOne($stateParams.id);
                }
            });
            //var question = $meteor.object(Questions, $stateParams.id, false);
            //$scope.question = {"_id":question._id,"label":question.label,answers:question.answers,respondents:question.respondents};
        }
        else {
            $scope.question = {"label":"",answers:[],respondents:[]};
            $scope.addAnswer("");
            $scope.addAnswer("");
        }
    };

    //*********************************************************************************************
    //********************************* Méthodes publiques ****************************************
    //*********************************************************************************************

    $scope.save = function() {

        Meteor.call('saveQuestion',  angular.copy($scope.question),function(err,id) {

            if(err){
                Notification.Error('An error has occurred');
                console.log(err);
                return;
            }

            if($stateParams.id && $stateParams.id==="new") {
                Notification.success('Question added successfully');
                $location.path("/question/" + id);
            }
            else {
                Notification.success('Changes saved successfully');
            }

        });

    }

    $scope.delete = function() {
        $scope.question.deleteDate=new Date();
        $scope.save();
        $scope.back();
    };

    $scope.back = function() {
        $location.path("/questionList");
    };

    $scope.dpdTypeSelect = function(item) {
        $scope.question.answers=item.values;
    };

    $scope.addAnswer = function(label) {
        $scope.question.answers.push({"_id":Random.id(),"label":label});
    };

    $scope.removeAnswer = function(id) {
        $scope.question.answers = _.without($scope.question.answers, _.findWhere($scope.question.answers, {_id: id}));
    };

    $scope.addRespondent = function(label) {
        $scope.question.respondents.push({"_id":Random.id(),"label":label});
    };

    $scope.removeRespondent = function(id) {
        $scope.question.respondents = _.without($scope.question.respondents, _.findWhere($scope.question.respondents, {_id: id}));
    };

    $scope.sendAll = function() {
        sendMail();
    };

    $scope.sendTo = function(idRespondent) {
        sendMail(idRespondent);
    };

    $scope.autorun(() => {
        if($stateParams.id && $stateParams.id!=="new") {
            getResultsClient($stateParams.id);
        }
    });

    //*********************************************************************************************
    //********************************** Initialisation *******************************************
    //*********************************************************************************************

    init();

    }
);

