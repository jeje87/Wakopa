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

            }
        }

    });
