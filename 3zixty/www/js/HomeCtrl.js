(function(){
    'use strict';
    angular.module('3zixsty').controller('HomeCtrl',['$scope','$http','DealService',HomeCtrl])
    function HomeCtrl($scope,$http,DealService,$ionicModal,$ionicSideMenuDelegate) {
        var vm= this;

        vm.toggleLeft = function ($scope) {
            $ionicSideMenuDelegate.toggleLeft();
        };

        vm.showSettings = function ($scope) {
            if (!$scope.settingsModal) {
                // Load the modal from the given template URL
                $ionicModal.fromTemplateUrl('settings.html', function (modal) {
                    $scope.settingsModal = modal;
                    $scope.settingsModal.show();
                }, {
                    // The animation we want to use for the modal entrance
                    animation: 'slide-in-up'
                });
            } else {
                $scope.settingsModal.show();
            }
        };
        vm.closeSettings = function ($scope) {
            $scope.modal.hide();
        };

        vm.loadDeals = function(forceRefresh) {
            var mylat,mylong;
            DealService.getMyLocation().then(function (position) {
                mylat=position.coords.latitude;
                mylong= position.coords.longitude;
            });


            DealService.getDealData(forceRefresh).then(function (data) {
                $scope.deals=[];
                _.chain(data.deals)
                    .map(function (item) {

                        var distance = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + mylat + ',' + mylong+ '&destinations=' + item.deal.merchant.latitude + ',' + item.deal.merchant.longitude + '&mode=bicycling&key=AIzaSyByDxWvEgih2DKTkLuHx7vPyGCMjqjxJwo';
                        $http.get(distance)
                            .success(function (result) {

                                {
                                    angular.extend(item,result);

                                    console.table(item);
                                    return $scope.deals.push(item);

                                }
                            })
                            .error(function (data, status, headers, config) {
                                console.log(data, status, "Error while making http call to distance matrix");
                                //    $ionicLoading.hide();

                            });


                    })

                //  console.log($scope.deals[0].deal.title);

            }).finally(function(){
                $scope.$broadcast('scroll.refreshComplete');
            });

        };


        $scope.doRefresh = function () {
            //  $scope.places.unshift({name: 'Incoming places ' + Date.now()})

            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
            vm.loadDeals(false);

        };



    };
})();

