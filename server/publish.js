Meteor.publish('Templates', function () {
    return Templates.find({"deleteDate": {$exists: false}});
});

Meteor.publish('Questions', function () {
    return Questions.find({"userId": this.userId, "deleteDate": {$exists: false}},{sort: {createDate: -1}});
});

Meteor.publish('QuestionsView', function () {
    return Questions.find({"deleteDate": {$exists: false}}, {sort: {createDate: -1}, fields: {mails: 0}});
});

//https://atmospherejs.com/percolate/find-from-publication
//https://www.discovermeteor.com/blog/pagination-problems-meteor/
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

