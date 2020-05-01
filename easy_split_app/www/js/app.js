// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var easy_split_app = angular.module('starter', ['ionic'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs).
      // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
      // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
      // useful especially with forms, though we would prefer giving the user a little more room
      // to interact with the app.
      if (window.cordova && window.Keyboard) {
        window.Keyboard.hideKeyboardAccessoryBar(true);
      }

      if (window.StatusBar) {
        // Set the statusbar to use the default style, tweak this to
        // remove the status bar on iOS or change it to use white instead of dark colors.
        StatusBar.styleDefault();
      }
    });
  })

easy_split_app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl',
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl',
      //      params: {
      //        user_name:''
      //      }
    })
  $urlRouterProvider.otherwise('/login');
});

easy_split_app.controller('HomeCtrl', function ($scope, $stateParams) {

});

easy_split_app.controller('LoginCtrl', function ($scope, LoginService) {

  $scope.data = {
    username: "",
    password: ""
  }

  $scope.login = function () {
    console.log("Inserted:" + $scope.data.username + " " + $scope.data.password)

    // easy_split_app.LoginService.check($scope.data.username, $scope.data.password)

    LoginService.check($scope.data.username, $scope.data.password)
      .then(function (data) {
          console.log(JSON.stringify(data));
        },

        function (err) {
          // error
          console.log("error")
        })



  }

});


// FACTORY
easy_split_app.factory('LoginService', ['$http', '$q',

  function ($http, $q) {

    var mDeferred = $q.defer();
    var service = {
      check: check,
    };

    return service;

    function check(username, password) {

      return $http.get("http://ie-mobileservices.eu-de.mybluemix.net/checkuser?username=" + username + "&password=" + password)
        .success(function (data, status) {
          if (data) {
            /*console.log("http post success"+JSON.stringify(data));
            console.log(status);*/
            mDeferred.resolve(true);

          }
        })
        .error(function (error, status) {
          console.log(error);
        });
    }

  }
])
