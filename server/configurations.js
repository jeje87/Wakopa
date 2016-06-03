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
