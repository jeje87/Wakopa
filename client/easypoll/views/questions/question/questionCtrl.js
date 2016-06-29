angular.module("easypoll").controller("QuestionCtrl",
    function ($scope, $stateParams, $meteor, $location, Notification, meteorService) {

        //*********************************************************************************************
        //************************************ Déclarations *******************************************
        //*********************************************************************************************

        //$scope.allowSave=false;
        //$scope.pageClass = 'page-home';
        $scope.results = {};
        $scope.navSelectedName = "";
        $scope.urlAnswer = undefined;

        Tracker.autorun(function () {
            meteorService.subscribe("Questions");
            meteorService.subscribe("Templates");
        });

        //*********************************************************************************************
        //********************************* Méthodes privées ******************************************
        //*********************************************************************************************

        let manageError = (error) => {
            Notification.error('An error has occurred');
            console.log(error);
        };

        let sendMail = (idRespondent) => {

            meteorService.sendQuestion($scope.question, idRespondent)
                .then(() => {
                    Notification.success('Question sended successfully');
                })
                .catch(err => {
                    manageError(err)
                });
        };

        //renvoi les résultats de la question affichée
        let getResultsClient = function (questionId) {

            meteorService.getResults(questionId)
                .then((data) => {
                    $scope.safeApply(function () {
                        $scope.results.labels = data.labels;
                        $scope.results.data = data.values;
                    });
                })
                .catch(err => {
                    manageError(err)
                });

        };

        let init = function () {

            if ($stateParams.id && $stateParams.id !== "new") {

                var url = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');

                $scope.urlAnswer = url + "/answer/" + $stateParams.id;
                
                $scope.helpers({
                    question: () => {
                        return Questions.findOne($stateParams.id);
                    }
                });

            }
            else {

                $scope.helpers({
                    question: () => {
                        return Templates.findOne({"name": "question"});
                    }
                });

                $scope.setActiveTab("Answers");
            }

            $scope.helpers({
                templateAnswers: () => {
                    return Templates.findOne({"name": "templateAnswers"});
                }
            });

        };

        //*********************************************************************************************
        //********************************* Méthodes publiques ****************************************
        //*********************************************************************************************

        /* conservation tab active*/
        $scope.setActiveTab = (activeTab, elem) => {
            localStorage.setItem("activeTab", activeTab);
        };

        $scope.getActiveTab = () => {
            return localStorage.getItem("activeTab");
        };

        $scope.isActiveTab = (index) => {
            var activeTab = $scope.getActiveTab();
            return (activeTab === index );
        };
        /* conservation tab active*/

        $scope.save = () => {

            meteorService.saveQuestion($scope.question)
                .then((id) => {
                    if ($stateParams.id && $stateParams.id === "new") {
                        Notification.success('Question added successfully');
                        $location.path("/question/" + id);
                    }
                    else {
                        Notification.success('Changes saved successfully');
                    }
                })
                .catch(err => {
                    manageError(err)
                });

            //Meteor.call('saveQuestion', angular.copy($scope.question),function(err, result){
            //    if(err){
            //        Notification.error('An error has occurred');
            //        console.log(err);
            //        return;
            //    }
            //   alert(result);
            //});

        };

        $scope.delete = () => {
            $scope.question.deleteDate = new Date();
            $scope.save();
            $scope.back();
        };

        $scope.back = () => {
            $location.path("/questionList");
        };

        $scope.dpdTypeSelect = (item) => {
            for(let i=0;i<item.values.length;i++) {
                item.values[i]._id = Random.id();
            }
            $scope.question.answers = item.values;
        };

        $scope.addAnswer = (label) => {
            $scope.question.answers.push({"_id": Random.id(), "label": label});
        };

        $scope.removeAnswer = (id) => {
            $scope.question.answers = _.without($scope.question.answers, _.findWhere($scope.question.answers, {_id: id}));
        };

        $scope.addRespondent = (label) => {
            $scope.question.respondents.push({"_id": Random.id(), "label": label});
        };

        $scope.removeRespondent = (id) => {
            $scope.question.respondents = _.without($scope.question.respondents, _.findWhere($scope.question.respondents, {_id: id}));
        };

        $scope.sendAll = () => {
            sendMail();
        };

        $scope.sendTo = (idRespondent) => {
            sendMail(idRespondent);
        };

        $scope.autorun(() => {
            if ($stateParams.id && $stateParams.id !== "new") {
                getResultsClient($stateParams.id);
            }
        });


        $scope.success = function () {
            console.log('Copied!');
        };

        $scope.fail = function (err) {
            console.error('Error!', err);
        };

        //*********************************************************************************************
        //********************************** Initialisation *******************************************
        //*********************************************************************************************

        init();

    }
);



