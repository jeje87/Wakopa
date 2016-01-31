angular.module('easypoll')

    .directive('cNavbar',function(){
        return {
            restrict : 'AE',
            scope : {
                brand : '=',
                username : '=',
                buttons : '=',
                navfn : '&'
            },
            templateUrl : 'client/easypoll/directives/cNavbar/cNavbar.html',
            controller : ['$scope','$element','$attrs',function($scope,$element,$attrs){

                $scope.defaults = {
                    brand : '<span class="glyphicon glyphicon-certificate"></span>',
                    buttons : []
                };

                $scope.noop = function(){
                    angular.noop();
                }; // end noop

                $scope.navAction = function(action){
                    $scope.navfn({'action' : action});
                }; // end navAction

                /**
                 * Have Branding
                 * Checks to see if the "brand" attribute was passed, if not use the default
                 * @result  string
                 */
                $scope.haveBranding = function(){
                    return (angular.isDefined($attrs.brand)) ? $scope.brand : $scope.defaults.brand;
                };

                /**
                 * Has Menus
                 * Checks to see if there were buttons passed in for the navbar.
                 * @result  boolean
                 */
                $scope.hasButtons = function(){
                    return (angular.isDefined($attrs.buttons));
                };

            }]
        };
    }); // end navbar

    //.run(function($templateCache){
    //    $templateCache.put('client/easypoll/directives/navbar.html','<nav class="navbar" ng-class="{\'navbar-inverse\': inverse,\'navbar-default\': !inverse,\'navbar-fixed-top\': affixed == \'top\',\'navbar-fixed-bottom\': affixed == \'bottom\'}" role="navigation"><div class="container-fluid"><div class="navbar-header"><button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu"><span class="sr-only">Toggle Navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" ng-click="noop()" ng-bind-html="haveBranding()"></a></div><div class="collapse navbar-collapse" id="navbar-menu"><ul class="nav navbar-nav" ng-if="hasMenus()"><li ng-repeat="menu in buttons" ng-class="{true: \'dropdown\'}[hasDropdownMenu(menu)]"><a ng-if="!hasDropdownMenu(menu)" ng-click="navAction(menu.action)">{{menu.title}}</a><a ng-if="hasDropdownMenu(menu)" class="dropdown-toggle" data-toggle="dropdown">{{menu.title}} <b class="caret"></b></a><ul ng-if="hasDropdownMenu(menu)" class="dropdown-menu"><li ng-repeat="item in menu.menu" ng-class="{true: \'divider\'}[isDivider(item)]"><a ng-if="!isDivider(item)" ng-click="navAction(item.action)">{{item.title}}</a></li></ul></li></ul><form ng-if="search.show" class="navbar-form navbar-right" role="search"><div class="form-group"><input type="text" class="form-control" placeholder="Search" ng-model="search.terms"><button class="btn btn-default" type="button" ng-click="searchfn()"><span class="glyphicon glyphicon-search"></span></button></div><div class="collapse navbar-collapse" id="navbar-menu-right"><ul class="nav navbar-nav navbar-right" ng-if="hasMenusRight()"><li ng-repeat="menu in rightmenus" ng-class="{true: \'dropdown\'}[hasDropdownMenu(menu)]"><a ng-if="!hasDropdownMenu(menu)" ng-click="navAction(menu.action)">{{menu.title}}</a><a ng-if="hasDropdownMenu(menu)" class="dropdown-toggle" data-toggle="dropdown">{{menu.title}} <b class="caret"></b></a><ul ng-if="hasDropdownMenu(menu)" class="dropdown-menu"><li ng-repeat="item in menu.menu" ng-class="{true: \'divider\'}[isDivider(item)]"><a ng-if="!isDivider(item)" ng-click="navAction(item.action)">{{item.title}}</a></li></ul></li></form></div></div></nav>');
    //});