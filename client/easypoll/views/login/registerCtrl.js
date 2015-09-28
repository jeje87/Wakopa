angular.module("easypoll").controller("RegisterCtrl", ['$scope', '$rootScope', '$location',
    function ($scope, $rootScope ,$location) {

        $scope.cancel = function() {
            $location.path('/login');
        };

        $scope.register = function() {

            var user = {'email':$scope.user.email,password:$scope.user.password,profile:{name:$scope.user.firstname +" "+$scope.user.lastname}};

            Accounts.createUser(user,function(err){
                if(!err) {
                    $rootScope.$broadcast('login');
                    $location.path('/questions');
                }
            });
        };

    }]
);
