
Meteor.publish('Templates', function () {
    return Templates.find({"deleteDate": {$exists: false}});
});

Meteor.publish('Questions', function (limit) {
    var dl = limit || 5;
    return Questions.find({"userId": this.userId, "deleteDate": {$exists: false}},{limit: dl, sort: {createDate: -1}});
});

Meteor.publish('QuestionsView', function () {
    return Questions.find({"deleteDate": {$exists: false}}, {sort: {createDate: -1}, fields: {mails: 0}});
});

FindFromPublication.publish('QuestionsUser', function(limit) {
    var dl = limit || 5;
    return Questions.find({"userId": this.userId, "deleteDate": {$exists: false}},{limit: dl, sort: {createDate: -1}});
});

//https://atmospherejs.com/percolate/find-from-publication
//https://www.discovermeteor.com/blog/pagination-problems-meteor/
FindFromPublication.publish('AnswersUser', function() {

    var user = Meteor.users.findOne(this.userId);
    var mail="-1";

    if(user.services && user.services.google ) {
        mail = user.services.google.email;
    }
    else if(user.services && user.services.facebook) {
        mail = user.services.facebook.email;
    }
    else if(user.emails) {
        mail = user.emails[0].address;
    }

    return Questions.find(
        {
            "respondents.email": mail,
            "deleteDate": {$exists: false}
        },
        {
            sort: {createDate: -1},
            fields: {_id: 1, label: 1, userId: 1, "respondents._id": 1}
        })
});

