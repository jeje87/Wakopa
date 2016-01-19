angular.module('easypoll')
.directive('tabset', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: { },
        templateUrl: 'client/easypoll/directives/tabs/tabset.html',
        bindToController: true,
        controllerAs: 'tabset',
        controller: function() {
            var self = this;
            self.tabs = [];
            self.select = function(selectedTab,$event) {
                if(selectedTab.disabled) { return }
                angular.forEach(self.tabs, function(tab) {
                    if(tab.active && tab !== selectedTab) {
                        tab.active = false;
                    }
                });
                selectedTab.active = true;
                angular.element($event.currentTarget).closest('ul').hide()
                    .prev('a').removeClass('open').text(selectedTab.heading);
            };

            self.addTab = function addTab(tab) {
                self.tabs.push(tab)
                if(self.tabs.length === 1) {
                    tab.active = true;
                    self.activeTab = tab.heading;
                }
            };

            //http://bootsnipp.com/snippets/featured/nav-tabs-dropdown
            $('.nav-tabs-dropdown').on('click', function(e) {

                e.preventDefault();

                $(e.target).toggleClass('open').next('ul').slideToggle();

            });


        }
    }
});