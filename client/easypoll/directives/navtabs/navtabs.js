angular.module('easypoll')
    .directive('navtabs', function() {
        return {

            restrict: 'E',
            templateUrl: 'directives/navtabs/navtabs.html',
            scope: {
                data:'='
            },
            bindToController: true,
            controllerAs: 'tabset',
            controller: function() {
                var self = this;
                self.tabs = [];
            },
            link: function(scope, element, attrs) {

            }
        }
    }
);