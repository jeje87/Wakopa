angular.module('easypoll')
    .service('meteorService', function() {

        this.saveQuestion = function(question) {

            return Meteor.callPromise('saveQuestion', angular.copy(question));

        }

        this.sendQuestion = function(question, idRespondent) {

            return Meteor.callPromise('sendQuestion', angular.copy(question), idRespondent);

        }

        this.getResults = function(questionId) {

            return Meteor.callPromise('getResults', questionId);

        }

    });


//var myModule = angular.module('easypoll', []);
//myModule.factory('serviceId', function() {
//    var shinyNewServiceInstance;
//    // factory function body that constructs shinyNewServiceInstance
//    return shinyNewServiceInstance;
//});
