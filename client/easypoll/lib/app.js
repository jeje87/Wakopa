angular.module('easypoll', ['angular-meteor', 'ui.router','mgcrea.ngStrap',
                            'ui-notification','ngSanitize','ui.sortable','ngAnimate','chart.js']);

angular.module('ng').run(['$rootScope', function($rootScope) {
    $rootScope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
            if(fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };
}]);

