/*gestion email 2*/

Meteor.startup(function(){

});


Meteor.methods({

        sendQuestion: function(question) {

            var user = Meteor.users.findOne({ "_id" : Meteor.userId() });
            var sender=user.profile.name;

            this.unblock();

            question.respondents.forEach(function(respondent) {

                if(respondent.email && respondent.email!=="") {

                    var answerId=Random.id();

                    var dns='http://www.wakopa.com/';
                    if(Meteor.absoluteUrl().indexOf("localhost")>-1) {
                        dns='http://localhost:3000/';
                    }

                    var urlAnswer = dns+'question/view/'+question._id+'/'+respondent._id+'/'+answerId;

                    var email = {
                        to: respondent.email,
                        from: 'no-reply@wakopa.com',
                        subject: sender + ' send you this question',
                        text: '',
                        html: question.label + '<br/><br/>You can give your answer here : ' + urlAnswer
                    };

                    sendEmailGunAPI(email, function (error, result) {
                        if (error) {
                            throwError(503, error.response.message, "");
                        }
                        else
                        {
                            //historise
                            //Questions.update( {"_id" : question._id , "respondents._id" : respondent._id } ,
                            //    {$addToSet : {"respondents.$.mails" : {'date' : new Date() ,'answerId':answerId }} } );
                            Questions.update( {"_id" : question._id } ,
                                {$addToSet : {"mails" : {'respondentId':respondent._id, 'date' : new Date() ,'answerId':answerId }} } );
                            //Questions.update( {"_id" : question._id } ,
                            //    {$set : {"mails" : {'respondentId':respondent._id, 'date' : new Date() ,'answerId':answerId }} } );
                        }
                    });
                }

            });
        }
    }
);

var sendEmailGunAPI = function(mailFields, callback) {

    var options = {
        apiKey: Meteor.settings.emailgunKey,
        domain: Meteor.settings.emailgunDomain
    }

    var mail = new Mailgun(options);

    var ret = mail.send({
        'to': mailFields.to,
        'from': mailFields.from,
        'html': mailFields.html,
        'text': mailFields.text,
        'subject': mailFields.subject,
        'tags': mailFields.tags
    });

    if (ret.error) {
        callback && callback(ret);
    }
    else
    {
        callback && callback(null,"ok");
    }
};
