// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var easy_split_app = angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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

easy_split_app.config(function($stateProvider, $urlRouterProvider) {
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
    
    .state('split', {
      url: '/split',
      templateUrl: 'templates/split.html',
      controller: 'CamCtrl',
    })
    $urlRouterProvider.otherwise('/split');
});

easy_split_app.controller('HomeCtrl', function($scope, $stateParams){
  
});

easy_split_app.controller('LoginCtrl', function($scope, $stateParams){
  $scope.data = $stateParams;
  
  console.log($scope.data);
});


easy_split_app.controller('CamCtrl', function($scope, CameraService){
    $scope.myimage = "img/nophoto.png";
    $scope.takepicture = function() {
      navigator.camera.getPicture(onSuccess, onFail, {
        quality: 20,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        correctOrientation:true,
     
      });
      function onSuccess(imageData) {
        $scope.$apply(function() {
          $scope.myimage = "data:image/jpeg;base64," + imageData;
          alert(imageData);
        });
      }
      function onFail(message) {
        alert('Failed because: ' + message);
      }
    }
  });