Meteor.publish('Templates', function () {
    return Templates.find({"deleteDate": {$exists: false}});
});

Meteor.publish('Questions', function () {
    return Questions.find({"userId": this.userId, "deleteDate": {$exists: false}},{sort: {createDate: -1}});
});

Meteor.publish('QuestionsView', function () {
    return Questions.find({"deleteDate": {$exists: false}}, {sort: {createDate: -1}, fields: {mails: 0}});
});

FindFromPublication.publish('AnswersUser', function() {
    return Questions.find(
        {
            "respondents._id": this.userId,
            "deleteDate": {$exists: false}
        },
        {
            sort: {createDate: -1},
            fields: {_id: 1, label: 1, userId: 1, "respondents._id": 1}
        })
});

var configureFacebook = function () {

    ServiceConfiguration.configurations.remove({
        service: "facebook"
    });
    ServiceConfiguration.configurations.insert({
        service: "facebook",
        appId: Meteor.settings.facebookAppId,
        secret: Meteor.settings.facebookSecret
    });

};

var configureGoogle = function () {

    ServiceConfiguration.configurations.remove({
        service: "google"
    });
    ServiceConfiguration.configurations.insert({
        service: "google",
        clientId: Meteor.settings.googleAppId,
        secret: Meteor.settings.googleSecret
    });

};


configureFacebook();
configureGoogle();