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
    .state('split', {
      url: '/split',
      templateUrl: 'templates/split.html',
      controller: 'CamCtrl',
      params: {
        splitType: ''
      }
    })
    .state('send', {
      url: '/send',
      templateUrl: 'templates/send.html',
      controller: 'SendCtrl'
    })
    .state('total', {
      url: '/total',
      templateUrl: 'templates/total.html',
      controller: ''
    })

  $urlRouterProvider.otherwise('/login');
});


easy_split_app.controller('HomeCtrl', function ($scope, $state, APIService) {
  $scope.data = {
    username: APIService.username,
    balance: false
  }

  $scope.checkUser = function () {
    if ($scope.data.username === undefined) {
      $state.go('login');
    } else {
      $scope.showBalance();
    }
  }

  $scope.showBalance = function () {
    console.log("Getting account balance for " + $scope.data.username + "...")

    APIService.getBalance($scope.data.username)
      .then(function (data) {
          $scope.data.balance = JSON.stringify(data.data.docs[0].balance)
          console.log($scope.data.balance);
        },

        function (err) {
          // error
          console.log("error")
        })
  }

  $scope.sendMoney = function () {
    // $scope.updateBalance(parseFloat($scope.data.balance) - 5)
    $state.go('send')
  }

  $scope.receiveMoney = function () {
    $scope.updateBalance(parseFloat($scope.data.balance) + 5)
  }

  $scope.updateBalance = function (balance) {
    APIService.modifyBalance($scope.data.username, balance)
      .then(function (data) {
          $scope.showBalance();
        },

        function (err) {
          // error
          console.log("error")
        })
  }

  $scope.goToJoinSplit = function () {
    $state.go('split');
  }
});

easy_split_app.controller('LoginCtrl', function ($scope, $state, APIService) {

  $scope.data = {
    username: "",
    password: ""
  }

  $scope.login = function () {
    APIService.check($scope.data.username, $scope.data.password)
      .then(function (data) {
          APIService.username = $scope.data.username;

          if (data.data.valid_user === "true") {
            console.log("Access granted to " + $scope.data.username)
            $state.go('home')
          } else {
            console.log("Access denied")
            $scope.incorrect_login = "Incorrect username or password";
          }
        },

        function (err) {
          // error
          console.log("error")
        })
  }
});

easy_split_app.controller('CamCtrl', function ($scope, $state, $ionicPopup) {

  $scope.data = {
    splitType: '',
  }

  $scope.splitTypeList = [{
    text: "Equal Split",
  }, {
    text: "Custom Split"
  }];

  $scope.no_photo = "img/no_photo.png";

  $scope.takepicture = function () {
    navigator.camera.getPicture(onSuccess, onFail, {
      quality: 20,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      correctOrientation: true,

    });

    function onSuccess(imageData) {
      $scope.$apply(function () {
        $scope.no_photo = "data:image/jpeg;base64," + imageData;
        alert(imageData);
      });
    }

    function onFail(message) {
      alert('Failed because: ' + message);
    }
  }
  $scope.clickPayment = function () {

    var splitTypePopup = $ionicPopup.confirm({
      templateUrl: 'orderPopup.html',
      title: 'Split Payment',
      scope: $scope,
      buttons: [{
        text: 'Continue',
        type: 'button-positive',
        onTap: function (e) {
          $state.go('total');
          //console.log($scope.choice);
        }
      }, {
        text: 'Close',
        type: 'button-default',
        onTap: function (e) {
          close;
        }
      }]
    });
  }

  $scope.goBack = function () {
    $state.go('home');
  }
});

easy_split_app.controller('SendCtrl', function ($scope, $state, $ionicPopup, APIService) {

  // Get username
  $scope.data = {
    username: APIService.username,
    balance: false,
    amount: null,
    receiver: ""
  }

  $scope.checkUser = function () {
    if ($scope.data.username === undefined) {
      $state.go('login');
    } else {
      $scope.showBalance();
    }
  }

  $scope.showBalance = function () {
    APIService.getBalance($scope.data.username)
      .then(function (data) {
          $scope.data.balance = JSON.stringify(data.data.docs[0].balance)
          console.log($scope.data.balance);
        },

        function (err) {
          // error
          console.log("error")
        })
  }

  $scope.sendMoney = function () {

    if (parseFloat($scope.data.balance) < $scope.data.amount) {
      console.log("Insufficient funds")
      $scope.fundsPopUp(false)
    } else {
      var current_balance_receiver = null;

      console.log("sending money...")
      console.log("amount: " + parseFloat($scope.data.amount))
      console.log("to: " + $scope.data.receiver)
      console.log("remaining balance: " + (parseFloat($scope.data.balance) - $scope.data.amount))

      // Updating sender balance 
      $scope.updateBalance($scope.data.username, parseFloat($scope.data.balance) - $scope.data.amount)

      // Updating receiver balance 

      console.log("Getting account balance for " + $scope.data.receiver + "...")

      APIService.getBalance($scope.data.receiver)
        .then(function (data) {
            current_balance_receiver = data.data.docs[0].balance
            console.log(current_balance_receiver);
            APIService.modifyBalance($scope.data.receiver, (current_balance_receiver + $scope.data.amount))
          },

          function (err) {
            // error
            console.log("error")
          })

      $scope.fundsPopUp(true)
      console.log("transaction completed")
    }
  }

  $scope.updateBalance = function (user, balance) {
    APIService.modifyBalance(user, balance)
      .then(function (data) {
          $scope.showBalance();
        },

        function (err) {
          // error
          console.log("error");
        })
  }

  $scope.fundsPopUp = function (success) {
    if (success) {
      message = "Funds transferred successfully!"
    } else {
      message = 'Insufficient Funds'
    }
    var confirmPopup = $ionicPopup.alert({
      title: message
    });
  }

  $scope.goBack = function () {
    $state.go('home');
  }
});

// FACTORY
easy_split_app.factory('APIService', ['$http', '$q',
  function ($http, $q) {

    var mDeferred = $q.defer();
    var service = {
      check: check,
      getBalance: getBalance,
      modifyBalance: modifyBalance
    };

    return service;

    // Check if username and password are valid 
    function check(username, password) {

      return $http.get("http://ie-mobileservices.eu-de.mybluemix.net/checkuser?username=" + username + "&password=" + password)
        .success(function (data) {
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
        .success(function (data) {
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

    function modifyBalance(username, balance) {
      return $http.get("http://ie-mobileservices.eu-de.mybluemix.net/modifybalance?username=" + username + "&balance=" + balance)
        .success(function (data) {
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
