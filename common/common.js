throwError = function(error, reason, details) {
    var meteorError = new Meteor.Error(error, reason, details);

    if (Meteor.isClient) {
        return meteorError;
    }

    if (Meteor.isServer) {
        throw meteorError;
    }
};

getCurrentUserEmail = function () {

    if (Meteor.isServer) {
        var user = Meteor.users.findOne(Meteor.userId());
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



