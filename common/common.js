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

    saveQuestion: function(question) {

        if(!question._id) {

            if(Meteor.isServer) {
                question.createDate = new Date();
                question.userId = Meteor.userId();
            }

            return Questions.insert(question);

        }
        else if(question.deleteDate) {

            if(Meteor.isServer) {
                question.deleteDate = new Date();
                question.deleteUser = Meteor.userId();
            }

            return Questions.update(
                {"_id":question._id},
                { $set:
                {
                    deleteDate: question.deleteDate,
                    deleteUser: question.deleteUser
                }
                }
            );

        }
        else
        {
            return Questions.update(
                {"_id":question._id},
                { $set:
                {
                    label: question.label,
                    answers: question.answers,
                    respondents: question.respondents
                }
                }
            );
        }

    }

});

