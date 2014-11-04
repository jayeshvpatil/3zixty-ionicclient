
(function(){
    'use strict';
    angular.module('3zixsty').factory('DealService',['$http','$q','$ionicLoading','$timeout','DSCacheFactory',DealService])
    function DealService($http,$q,$ionicLoading,$timeout,DSCacheFactory) {

        self.locationcache = DSCacheFactory.get("locationcache");
        self.dealscache  = DSCacheFactory.get("dealscache");
        var dealurl = 'http://api.sqoot.com/v2/deals?api_key=2q074y';

        var radius=500;
        var categories=['travel'];
        var providers=['groupon','livingsocial','travelzoo'];
        //  var mylat;
        //  var mylong;

        //  var options = {
        //     frequency: 1000,
        //    timeout: 3000,
        //   enableHighAccuracy: true
        // };


        self.locationcache.setOptions({
            onExpire: function(key,value){
                getMyLocation()
                    .then(function() {
                        console.log("location was automatically refreshed");
                    },function(){
                        console.log("Error getting data. Putting expired item back in cache");
                        self.locationcache.put(key,value);
                    });

            }
        });
        self.dealscache.setOptions({
            onExpire: function(key,value){
                getDealData()
                    .then(function() {
                        console.log("Deal data cache was automatically refreshed");
                    },function(){
                        console.log("Error getting data. Putting expired item back in cache");
                        self.dealscache.put(key,value);
                    });

            }
        });

        self.staticCache=DSCacheFactory.get("staticCache");
        function setDealId(DealId){
            self.staticCache.put("currentDealId",DealId);
        }
        function getDealId(){
            return self.staticCache.get("currentDealId");
        }

        function getMyLocation(){
            var   deferred = $q.defer(),
                cacheKey="mylocation",
                mylocationdata = self.locationcache.get(cacheKey);
            if(mylocationdata)
            {
                console.log("Found data inside location cache",mylocationdata);
                deferred.resolve(mylocationdata);

            //    mylat= mylocationdata.coords.latitude;
              //  mylong=mylocationdata.coords.longitude;
            }
            else {

                   navigator.geolocation.getCurrentPosition(function (data) {
                       self.locationcache.put(cacheKey,data);
                        //mylat=data.coords.latitude;
                       // mylong=data.coords.longitude;
                       deferred.resolve(data);
                   }, function (error) {
                       console.log("Error while getting location");
                       deferred.reject();
                   });


            }
            return deferred.promise;
        }

        function getDealData(forceRefresh){
            if(typeof forceRefresh==="undefined"){forceRefresh=false};
            var  deferred = $q.defer(),
                cacheKey="dealdata",
                dealsjson=[];
            console.log("inside getDealData");

           //   $ionicLoading.show({template:"Loading..."});
            if(!forceRefresh)
            {
                dealsjson=self.dealscache.get(cacheKey);
            }
            if (dealsjson)
            {
                console.log("Found deals inside deals cache",dealsjson);
                deferred.resolve(dealsjson);

            }
            else
            {
                getMyLocation().then(function (data) {
                    dealurl = dealurl + '&location=' + data.coords.latitude+ ',' +data.coords.longitude + '&category_slugs='+categories+'&provider_slugs='+providers+'&radius='+radius;
                    $http.get(dealurl)
                        .success(function (data, status) {
                            console.log("Recieve scheduled data via Http.", data, status);
                            self.dealscache.put(cacheKey,data);
                            $ionicLoading.hide();
                            deferred.resolve(data);

                        })
                        .error(function () {
                            console.log("Error while making http call---");
                            $ionicLoading.hide();
                            deferred.reject();
                        });
                }).finally(function(){
                    console.log("get Deals completed");
                });




            }
return deferred.promise;
        };



        return {
            getMyLocation : getMyLocation,
            getDealData : getDealData


        };
    }

})();