angular.module('easypoll')
    .service('contextService', function () {


        let context = Session.get('context') || {};

        return {

            getContext: () => {

                return context;

            },
            saveContext: () => {

                Session.set('context', context);

            }
        }

    });

