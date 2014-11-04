// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('3zixsty', ['ionic','angular-data.DSCacheFactory'])

.run(function($ionicPlatform,DSCacheFactory) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)


    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
      DSCacheFactory("locationcache",{storageMode:"localStorage",maxAge:20000,deleteOnExpire:"aggressive"});
      DSCacheFactory("dealscache",{storageMode:"localStorage",maxAge:20000,deleteOnExpire:"aggressive"});
      DSCacheFactory("staticCache",{storageMode:"localStorage"});
  });
})
.config(function($stateProvider,$urlRouterProvider){
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller:"HomeCtrl",
                data:{login:true}
            })
            .state('app.home',{
                url:"/home",

                views: {
                    'menuContent': {
                        templateUrl: "templates/home.html"

                    }

                },
                controller:"HomeCtrl",
                data:{public:true}
            })
            .state('app.pref', {
                url: "/pref",
                views: {
                    'menuContent': {
                        templateUrl: "templates/pref.html",
                        data:{login:true}
                    }
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                data: { public: true } })

            .state('signup', {
                url: '/signup',
                templateUrl: 'templates/signup.html',
                data: { login: true }})

        .state('reset-password', {
                url:'/reset-password',
                templateUrl: 'templates/reset-password.html',
                data:{public:true}
                })
        .state('set-password', {
                url:'/set-password',
                templateUrl: 'templates/set-password.html',
                data:{public:true},
                set_password: true})
         ;
        // fallback route
        $urlRouterProvider.otherwise('/app/home');
});

