/*gestion email 2*/

Meteor.startup(function(){

});


Meteor.methods({

        sendQuestion: function(question, idRespondent) {

            var user = Meteor.users.findOne({ "_id" : Meteor.userId() });
            var sender=user.profile.name;

            this.unblock();

            question.respondents.forEach(function(respondent) {

                if (!idRespondent || idRespondent===respondent._id) { //soit tout le monde soit un seul répondant

                    if (respondent.email && respondent.email !== "") {

                        var answerId = Random.id();

                        var dns = 'http://www.wakopa.com/';
                        if (Meteor.absoluteUrl().indexOf("localhost") > -1) {
                            dns = 'http://localhost:3000/';
                        }

                        var urlAnswer = dns + 'question/view/' + question._id + '/' + respondent._id + '/' + answerId;

                        var html = `<div style="margin:0 auto;">
                                        <div style="background:white;text-align:center;width:350px;margin:0 auto;padding:10px;border-radius:10px;border:4px solid #337ab7;color:#000000;">
                                            <h3 style="text-align:center;font-size:1.5em;font-weight:500;color:#337ab7;margin-top:0;"><a href="http://www.wakopa.com/">EasyPoll</a></h3>
                                            <p style="color:#000000;">${sender} vous a posé cette question :</p>
                                            <p style="font-size:1.2em;color:#000000;">${question.label}</p>
                                            <a style="padding:15px 16px;text-align:center;line-height:1.3;text-decoration:none;display:inline-block;font-weight:400;border-radius:3px;background:#337ab7;color:white"
                                                href="${urlAnswer}" target="_blank">
                                                Donner votre réponse ici
                                            </a>
                                            <p style="color:#000000;">Aucune inscription n'est nécessaire !</p>
                                            <p style="font-size:0.8em;color:#000000;">Cet email à été généré automatiquement
                                                <br />par l'application <a style="color:#337ab7;text-decoration: underline;" href="http://www.wakopa.com/">EasyPoll</a>.
                                                <br />Merci de ne pas y répondre.</p>
                                        </div>
                                    </div>`;

                        var email = {
                            to: respondent.email,
                            from: 'EasyPoll <Easy.Poll@wakopa.com>',
                            subject: sender + ' vous a posé une question',
                            text: '',
                            html: html
                        };

                        sendEmailGunAPI(email, function (error, result) {
                            if (error) {
                                throwError(503, error.response.message, "");
                            }
                            else {
                                //historise
                                //Questions.update( {"_id" : question._id , "respondents._id" : respondent._id } ,
                                //    {$addToSet : {"respondents.$.mails" : {'date' : new Date() ,'answerId':answerId }} } );
                                Questions.update({"_id": question._id},
                                    {
                                        $addToSet: {
                                            "mails": {
                                                'respondentId': respondent._id,
                                                'date': new Date(),
                                                'answerId': answerId
                                            }
                                        }
                                    });
                                //Questions.update( {"_id" : question._id } ,
                                //    {$set : {"mails" : {'respondentId':respondent._id, 'date' : new Date() ,'answerId':answerId }} } );
                            }
                        });
                    }
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
