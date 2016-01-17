angular.module("easypoll").controller("QuestionCtrl", function ($scope, $stateParams,$meteor,$location,Notification) {

    //*********************************************************************************************
    //************************************ Déclarations *******************************************
    //*********************************************************************************************

    //$scope.allowSave=false;
    //$scope.pageClass = 'page-home';
    $scope.results = {};
    $scope.navSelectedName="";

    $scope.subscribe('Questions', () => [
    ]);

    $scope.subscribe('Templates', () => [
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

        }
        else {

            $scope.helpers({
                question: () => {
                    return Templates.findOne({"name":"question"});
                }
            });

            $scope.setActiveTab("Answers");
        }

        $scope.helpers({
            templateAnswers: () => {
                return Templates.findOne({"name":"templateAnswers"});
            }
        });

        $(function() {

            //$('.nav-tabs-dropdown').each(function(i, elm) {
            //
            //    $(elm).text($(elm).next('ul').find('li.active a').text());
            //
            //});
            //http://bootsnipp.com/snippets/featured/nav-tabs-dropdown
            $('.nav-tabs-dropdown').on('click', function(e) {

                e.preventDefault();

                $(e.target).toggleClass('open').next('ul').slideToggle();

            });

            $('#nav-tabs-wrapper a[data-toggle="tab"]').on('click', function(e) {

                e.preventDefault();

                $(e.target).closest('ul').hide().prev('a').removeClass('open').text($(this).text());

            });
        });
    };

    //*********************************************************************************************
    //********************************* Méthodes publiques ****************************************
    //*********************************************************************************************

    /* conservation tab active*/
    $scope.setActiveTab = function( activeTab, elem ){
        localStorage.setItem("activeTab", activeTab);
     };

    $scope.getActiveTab = function(){
        return localStorage.getItem("activeTab");
    };

    $scope.isActiveTab = function( index ){
        var activeTab = $scope.getActiveTab();
        return (activeTab === index );
    };
    /* conservation tab active*/

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

    };

    $scope.delete = function() {
        $scope.question.deleteDate=new Date();
        $scope.save();
        $scope.back();
    };

    $scope.back = function() {
        $location.path("/questionList");
    };

    $scope.dpdTypeSelect = function(item) {
        item._id = Random.id();
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



