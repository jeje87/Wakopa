Meteor.publish('Subjects', function(userId){
    return Subjects.find({userId:userId});
});

Meteor.publish('Templates', function(){
    return Templates.find({"deleteDate": { $exists: false}});
});

Meteor.publish('Questions', function(){
    return Questions.find({"userId":this.userId, "deleteDate": { $exists: false}});
});

Meteor.publish('QuestionsView', function() {
    return Questions.find({"deleteDate": { $exists: false}},{fields: {mails:0}});
});

var configureFacebook = function() {

    ServiceConfiguration.configurations.remove({
        service: "facebook"
    });
    ServiceConfiguration.configurations.insert({
        service: "facebook",
        appId: Meteor.settings.facebookAppId,
        secret: Meteor.settings.facebookSecret
    });

};

var configureGoogle = function() {

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