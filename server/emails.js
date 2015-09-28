/*gestion email 2*/

Meteor.startup(function(){

});


Meteor.methods({

        sendQuestion: function(question) {

            var email = {
                to: 'jeromepiquet@gmail.com',
                from: 'no-reply@wakopa.com',
                subject: 'Jerome send you this question',
                text: '',
                html: question.label
            };

            this.unblock();

            sendEmailGunAPI(email,function (error, result) {
                if (error) {
                    throwError(503,error.response.message,"");
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
