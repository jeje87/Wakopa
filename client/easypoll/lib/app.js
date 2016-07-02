angular.module('easypoll', ['angular-meteor','angular-meteor.auth', 'ui.router','mgcrea.ngStrap',
                            'ui-notification','ngSanitize','ui.sortable','ngAnimate',
                            'frapontillo.bootstrap-switch','chart.js','angular-clipboard']);

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


