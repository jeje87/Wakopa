throwError = function(error, reason, details) {
    var meteorError = new Meteor.Error(error, reason, details);

    if (Meteor.isClient) {
        return meteorError;
    }

    if (Meteor.isServer) {
        throw meteorError;
    }
};


Meteor.methods({

    saveQuestion: function (question) {

        if (!question._id) {

            if (Meteor.isServer) {
                question.createDate = new Date();
                question.userId = Meteor.userId();
            }

            return Questions.insert(question);

        }
        else if (question.deleteDate) {

            if (Meteor.isServer) {
                question.deleteDate = new Date();
                question.deleteUser = Meteor.userId();
            }

            return Questions.update(
                {"_id": question._id},
                {
                    $set: {
                        deleteDate: question.deleteDate,
                        deleteUser: question.deleteUser
                    }
                }
            );

        }
        else {
            return Questions.update(
                {"_id": question._id},
                {
                    $set: {
                        label: question.label,
                        answers: question.answers,
                        respondents: question.respondents
                    }
                }
            );
        }

    },
    selectedAnswer: function (questionId,respondentId,answerId,selectedAnswerId) {

        var question = Questions.findOne({"_id" : questionId,"respondents._id" : respondentId, "mails.answerId" : answerId });
        if(question) {
            var selAnswer = _.findWhere(question.answers, {_id: selectedAnswerId});

            if (Meteor.isClient) {
                selAnswer.selected = true;
            }
            else if (Meteor.isServer) {

                if (!selAnswer.selectedBy) {
                    selAnswer["selectedBy"] = [];
                }

                //var curRespondent = _.findWhere($scope.question.respondents, {_id: $scope.respondentId});
                selAnswer.selectedBy.push(respondentId);

                Questions.update(
                    {"_id": question._id, "answers._id": selectedAnswerId},
                    {
                        $addToSet: {"answers.$.selectedBy": {"respondentId" : respondentId}}
                    }
                )
            }

            return true;
        }
        else
        {
            throwError(401, "", "");
        }


    },
    isAuthorized: function (questionId, respondentId, answerId) {

        //var question = Questions.findOne({"_id" : questionId,"respondents._id" : respondentId, "respondents.mails" : { $elemMatch: { "answerId":  answerId }}})
        var question = Questions.findOne({"_id" : questionId,"respondents._id" : respondentId, "mails.answerId" : answerId });

        if(question)
        {
           return true;
        }
        else
        {
            throwError(401, "", "");
        }
    }

});

