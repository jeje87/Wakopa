getUserEmailLogin = function (userId) {
    var user = Meteor.users.findOne(userId);
    var mail="";

    if(user.services && user.services.google ) {
        mail = user.services.google.email;
    }
    else if(user.services && user.services.facebook) {
        mail = user.services.facebook.email;
    }
    else if(user.emails) {
        mail = user.emails[0].address;
    }
    return mail;
};
