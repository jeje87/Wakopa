Questions = new Mongo.Collection('questions');

Meteor.methods({

    saveQuestion : (question) => {

        if (question._id === "-1") {

            delete question._id; //pour utiliser un id auto

            question.createDate = new Date();
            question.userId = Meteor.userId();
            question.answerId = generateUUID();

            var ret =  Questions.insert(question);

            return ret;

        }
        else if (question.deleteDate) {

            return Questions.update(
                {"_id": question._id},
                {
                    $set: {
                        deleteDate: new Date(),
                        deleteUser: Meteor.userId()
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
    getAnswerUserFromMail: (answerId) => {

        if(Meteor.isServer) {
            let email = getCurrentUserEmail();

            let question = Questions.findOne({"answerId": answerId});

            // let question = Questions.findOne({
            //     "answerId": questionId,
            //     "respondents.email": email
            // });

            if(question) {
                for (let i = 0; i < question.respondents.length; i++) {
                    if (question.respondents[i].email === email) {
                        if (!question.respondents[i].answers) {
                            question.respondents[i].answers = [];
                        }
                        return question.respondents[i];
                    }
                }
            }

            return null;
        }

    },
    getAnswerUserFromIds: (questionId, respondentId, answerId) => {

        if(Meteor.isServer) {
            //consultation depuis un lien
            //on utilise les id  pour récuperer la réponse de l'utilisateur
            let question = Questions.findOne({
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

            //si on en est là c'est qu'il y'a un prb !!
            return null;

        }

    },
    getAnswerUser: (questionId, respondentId, answerId) => {
        if (!respondentId) {
            return Meteor.call("getAnswerUserFromMail",questionId);
        }
        else {
            return Meteor.call("getAnswerUserFromIds",questionId, respondentId, answerId);
        }
    },
    selectAnswerFromEmail: (questionId, selectedAnswerId) => {

        if(Meteor.isServer) {
            let email = getCurrentUserEmail();

            let question = Questions.findOne({
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

            return true;
        }

    },
    selectAnswerFromIds: (questionId, selectedAnswerId, respondentId, answerId) => {

        if(Meteor.isServer) {
            //consultation depuis un lien
            //on utilise les id  pour récuperer la réponse de l'utilisateur
            let question = Questions.findOne({
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

            return true;
        }

    },
    selectAnswer: (questionId, selectedAnswerId, respondentId, answerId) => {

        if (!respondentId) {

           return Meteor.call("selectAnswerFromEmail",questionId, selectedAnswerId);

        }
        else {

            return Meteor.call("selectAnswerFromIds",questionId, selectedAnswerId, respondentId, answerId);

        }

    },
    isAuthorized: (questionId, respondentId, answerId) => {

        let query;

        if (respondentId && answerId) {
            //provenance = lien
            query = {"_id": questionId, "respondents._id": respondentId, "mails.answerId": answerId};
        }
        else {
            //provenance = interface
            let mail = getCurrentUserEmail();
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
    getResults: (questionId) => {

        var question = Questions.findOne({"_id": questionId});

        var data = {"_ids": [], "labels": [], "values": []};

        if (question && Meteor.isServer) {
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


    },
    getResultsFromAnswer: (answerId) => {

        var question = Questions.findOne({"answerId": answerId});

        var data = {"_ids": [], "labels": [], "values": []};

        if (question && Meteor.isServer) {
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
