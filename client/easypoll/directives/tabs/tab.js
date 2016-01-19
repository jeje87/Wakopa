angular.module('easypoll')
.directive('tab', function() {
    return {
        restrict: 'E',
        transclude: true,
        template: '<div role="tabpanel" ng-show="active" ng-transclude></div>',
        require: '^tabset',
        scope: {
            heading: '@'
        },
        link: function(scope, elem, attr, tabsetCtrl) {
            scope.active = false;
            scope.disabled = false;
            if(attr.disable) {
                attr.$observe('disable', function(value) {
                    scope.disabled = (value !== 'false');
                })
            }
            tabsetCtrl.addTab(scope);

        }
    }
});