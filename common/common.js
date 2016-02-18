throwError = function(error, reason, details) {
    var meteorError = new Meteor.Error(error, reason, details);

    if (Meteor.isClient) {
        return meteorError;
    }

    if (Meteor.isServer) {
        throw meteorError;
    }
};

getQuestion = function (questionId, respondentId, answerId) {

    if (Meteor.isServer) {

        let question;

        if(typeof respondentId === "undefined") {

            let email = getUserEmailLogin(this.userId);

            question = Questions.findOne({
                "_id": questionId,
                "respondents.email": email
            });

        }
        else {

            //consultation depuis un lien
            //on utilise les id  pour récuperer la réponse de l'utilisateur
            question = Questions.findOne({
                "_id": questionId,
                "respondents._id": respondentId,
                "mails.answerId": answerId
            });

        }

        return question;
    }
};

getUserEmailLogin = function (userId) {

    if (Meteor.isServer) {
        var user = Meteor.users.findOne(userId);
        var mail = "";

        if (user.services && user.services.google) {
            mail = user.services.google.email;
        }
        else if (user.services && user.services.facebook) {
            mail = user.services.facebook.email;
        }
        else if (user.emails) {
            mail = user.emails[0].address;
        }
        return mail;
    }
};


Meteor.methods({

    saveQuestion: function (question) {

        if (question._id === "-1") {

            delete question._id; //pour utiliser un id auto

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
    getAnswerUser: function (questionId, respondentId, answerId) {

        if (Meteor.isServer) {

            let question;

            if (!respondentId) {

                let email = getUserEmailLogin(this.userId);

                question = Questions.findOne({
                    "_id": questionId,
                    "respondents.email": email
                });

                for (let i = 0; i < question.respondents.length; i++) {
                    if (question.respondents[i].email === email) {
                        if (!question.respondents[i].answers) {
                            question.respondents[i].answers = [];
                        }
                        return question.respondents[i];
                    }
                }
            }
            else {

                //consultation depuis un lien
                //on utilise les id  pour récuperer la réponse de l'utilisateur
                question = Questions.findOne({
                    "_id": questionId,
                    "respondents._id": respondentId,
                    "mails.answerId": answerId
                });

                for (let i = 0; i < question.respondents.length; i++) {
                    if (question.respondents[i]._id == respondentId) {
                        if (!question.respondents[i].answers) {
                            question.respondents[i].answers = [];
                        }
                        return question.respondents[i];
                    }
                }
            }

            //si on en est là c'est qu'il y'a un prb !!
            return null;
        }

    },
    selectAnswer: function (questionId, selectedAnswerId, respondentId, answerId) {

        if (Meteor.isServer) {
            let question;

            if (!respondentId) {

                let email = getUserEmailLogin(this.userId);

                question = Questions.findOne({
                    "_id": questionId,
                    "respondents.email": email
                });

                //supprime les réponses existantes pour cet utilisateur
                Questions.update(
                    {
                        "_id": question._id, "respondents.email": email
                    },
                    {
                        $set: {'respondents.$.answers': []}
                    }
                );

                //si le tableau answers n'existe pas, il est créé
                //prévu pour les reponses multiples
                Questions.update(
                    {
                        "_id": question._id, "respondents.email": email
                    },
                    {
                        $addToSet: {"respondents.$.answers": selectedAnswerId}
                    }
                );
            }
            else {

                //consultation depuis un lien
                //on utilise les id  pour récuperer la réponse de l'utilisateur
                question = Questions.findOne({
                    "_id": questionId,
                    "respondents._id": respondentId,
                    "mails.answerId": answerId
                });

                //supprime les réponses existantes pour cet utilisateur
                Questions.update(
                    {
                        "_id": question._id, "respondents._id": respondentId
                    },
                    {
                        $set: {'respondents.$.answers': []}
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

    },
    isAuthorized: function (questionId, respondentId, answerId) {

        let query;

        if (respondentId && answerId) {
            //provenance = lien
            query = {"_id": questionId, "respondents._id": respondentId, "mails.answerId": answerId};
        }
        else {
            //provenance = interface
            let mail = getUserEmailLogin(this.userId);
            query = {"_id": questionId, "respondents.email": mail};
        }

        var question = Questions.findOne(query);

        if (question) {
            return true;
        }
        else {
            throwError(401, "", "");
        }
    },
    getResults: function (questionId) {

        var question = Questions.findOne({"_id": questionId});

        var data = {"_ids": [], "labels": [], "values": []};

        if (Meteor.isServer) {
            question.answers.forEach(function (answer) {
                data._ids.push(answer._id);
                data.labels.push(answer.label);
                data.values.push(0);
            });

            question.respondents.forEach(function (respondent) {
                if (respondent.answers) {
                    respondent.answers.forEach(function (_id) {
                        var findId = data._ids.indexOf(_id);
                        if (findId !== -1) {
                            data.values[findId] += 1;
                        }
                    });
                }
            });
        }

        return data;


    }

});

