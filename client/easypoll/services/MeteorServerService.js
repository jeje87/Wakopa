angular.module('easypoll')
    .service('meteorService', function () {

        return {

            saveQuestion: (question) => {

                return Meteor.callPromise('saveQuestion', angular.copy(question));

            },
            sendQuestion: (question, idRespondent) => {

                return Meteor.callPromise('sendQuestion', angular.copy(question), idRespondent);

            },
            getResults: (questionId) => {

                return Meteor.callPromise('getResults', questionId);

            },
            subscribe: (subscription, limit, search, callback) => {

                Meteor.subscribe(subscription, limit, search, callback);

            },
            subscribeAnswersUser: (limit) => {

                Meteor.subscribe("AnswersUser", limit);

            }
        }

    });
