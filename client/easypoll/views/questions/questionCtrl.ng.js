angular.module("easypoll").controller("QuestionCtrl", function ($scope, $stateParams,$meteor,$location,Notification) {

        $scope.pageClass = 'page-home';
        $meteor.subscribe('Questions');

        $scope.typeAnswers = [
                {"_id":"1", "label":"Yes or No","values":[{"_id":Random.id(),"label":"Yes"},{"_id":Random.id(),"label":"No"}]},
                {"_id":"2", "label":"Yes, No or Maybe","values":[{"_id":Random.id(),"label":"Yes"},{"_id":Random.id(),"label":"No"},{"_id":Random.id(),"label":"Maybe"}]}
            ];

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

        $scope.send = function() {
            Meteor.call('sendQuestion',  angular.copy($scope.question),function(err,id) {

                if(err){
                    Notification.error('An error has occurred');
                    console.log(err);
                    return;
                }
                console.log(id);
                Notification.success('Question sended successfully');

            });
        };

        if($stateParams.id && $stateParams.id!=="new") {
            var question = $meteor.object(Questions, $stateParams.id, false);
            $scope.question = {"_id":question._id,"label":question.label,answers:question.answers,respondents:question.respondents};
        }
        else {
            $scope.question = {"label":"",answers:[],respondents:[]};
            $scope.addAnswer("");
            $scope.addAnswer("");
        }

    }
);

