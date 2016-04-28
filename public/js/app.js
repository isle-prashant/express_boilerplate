/**
 * Created by PRASHANT on 10-04-2016.
 */
var app = angular.module('myApp', ['ngResource', 'ngRoute']);
/*Factory for tweets*/
app.factory('Tweet', function($resource) {
    return $resource('/api/tweets/:id', null, {
        'update': {
            method: 'PUT'
        }
    });
});
/*Factory for socket*/
app.factory('socket', function($rootScope) {
    var socket = io.connect();
    return {
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});
app.controller('TweetController', function($http, $scope, Tweet, socket) {
    $scope.tweets = [];
    $scope.TweetObject = {};
    $scope.tweets = Tweet.query();
    $scope.postTweet = function() {
        var newTweet = new Tweet();
        newTweet.tweet = $scope.tweet;
        newTweet.$save(function(tweet) {
            console.log(tweet);
            $scope.tweet = "";
        }, function(err) {
            console.log(err);
        });
    };

    socket.on('tweet', function(tweet){
        $scope.tweets.unshift(tweet);
    })
});
app.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/html/home.html',
        controller: 'TweetController'
    }).otherwise({
        templateUrl: '/html/home.html',
        controller: 'TweetController'
    });
    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});