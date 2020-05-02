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
      controller: 'HomeCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
  $urlRouterProvider.otherwise('/login');
});

easy_split_app.controller('HomeCtrl', function ($scope, APIService) {

  // Get username
  $scope.data = {
    username: APIService.username,
    balance: '-'
  }

  $scope.hi = function () {
    console.log("hello")
  }
  
  $scope.showBalance = function () {
    console.log("Getting account balance for: " + $scope.data.username)

    APIService.getBalance($scope.data.username)
      .then(function (data) {
          console.log(JSON.stringify(data.data.docs[0].balance));
          $scope.data.balance = JSON.stringify(data.data.docs[0].balance)
        },

        function (err) {
          // error
          console.log("error")
        })
  }
});

easy_split_app.controller('LoginCtrl', function ($scope, $state, APIService) {

  $scope.data = {
    username: "",
    password: ""
  }

  $scope.login = function () {
    console.log("Inserted:" + $scope.data.username + " " + $scope.data.password)

    APIService.check($scope.data.username, $scope.data.password)
      .then(function (data) {
          console.log(JSON.stringify(data.data.valid_user));

          APIService.username = $scope.data.username;

          if (data.data.valid_user === "true") {
            console.log("access granted")
            $state.go('home')
          } else {
            console.log("access denied")
          }
        },

        function (err) {
          // error
          console.log("error")
        })
  }
});


// FACTORY
easy_split_app.factory('APIService', ['$http', '$q',


  function ($http, $q) {

    var username = "";

    var mDeferred = $q.defer();
    var service = {
      check: check,
      getBalance: getBalance
    };

    return service;

    // Check if username and password are valid 
    function check(username, password) {

      return $http.get("http://ie-mobileservices.eu-de.mybluemix.net/checkuser?username=" + username + "&password=" + password)
        .success(function (data, status) {
          if (data) {
            /*console.log("http post success"+JSON.stringify(data));
            console.log(status);*/
            mDeferred.resolve(true);

          }
        })
        .error(function (error) {
          console.log(error);
        });
    }

    function getBalance(username) {

      return $http.get("http://ie-mobileservices.eu-de.mybluemix.net/checkbalance?username=" + username)
        .success(function (data, status) {
          if (data) {
            /*console.log("http post success"+JSON.stringify(data));
            console.log(status);*/
            mDeferred.resolve(true);

          }
        })
        .error(function (error) {
          console.log(error);
        });
    }
  }
])
