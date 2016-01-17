// run this when the meteor app is started
Meteor.startup(function() {

    // if there are no polls available create sample data
    if (Templates.find({"name":"question"}).count() === 0) {

        // create sample polls
        var question =
            {
                "_id" : "-1",
                "name" : "question",
                "label" : "",
                "answers" : [
                    {
                        "_id" : "1",
                        "label" : ""
                    },
                    {
                        "_id" : "2",
                        "label" : ""
                    }
                ],
                "respondents" : [],
                "createDate" : "",
                "userId" : "",
                "mails" : []
            }
        ;
        Templates.insert(question);
    }
});
