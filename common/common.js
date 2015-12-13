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
    getResults: function (questionId) {

        var question = Questions.findOne({"_id": questionId});

        var data = [];

        if (Meteor.isServer) {
            question.answers.forEach(function (answer) {
                data.push(
                    {
                        "_id": answer._id,
                        "key": answer.label,
                        "y": 0
                    }
                );
            });

            question.respondents.forEach(function (respondent) {
                if (respondent.answers) {
                    respondent.answers.forEach(function (_id) {
                        var findAnswer = _.findWhere(data, {"_id": _id});
                        if (findAnswer) {
                            findAnswer.y += 1;
                        }
                    });
                }
                ;
            });
        }

        return data;


    },
    selectedAnswer: function (questionId,respondentId,answerId,selectedAnswerId) {

        var question = Questions.findOne({"_id" : questionId,"respondents._id" : respondentId, "mails.answerId" : answerId });
        if(question) {

            if (Meteor.isClient) {

            }
            else if (Meteor.isServer) {

                //supprime les réponses existantes
                Questions.update(
                    {
                        "_id": question._id, "respondents._id": respondentId
                    },
                    {
                        $set : {'respondents.$.answers': [] }
                    }
                );

                //si le tableau answers n'existe pas, il est créé
                //prévu pour les reponses multiples
                Questions.update(
                    {
                        "_id": question._id, "respondents._id": respondentId
                    },
                    {
                        $addToSet: {"respondents.$.answers": selectedAnswerId}
                    }
                );
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

