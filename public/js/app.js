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
/*Factory for comments*/
app.factory('Comment', function($resource) {
    return $resource('/api/comments/:id', null, {
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
app.directive('myEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
});
/*a controller for the comments*/
app.controller('CommentController', function($routeParams, $scope, Comment, Tweet, socket) {
    $scope.comments = [];
    $scope.currentTweet = Tweet.get({
        id: $routeParams.id
    });
    $scope.comments = Comment.query({
        id: $routeParams.id
    });
    /*To post a new Comment*/
    $scope.postComment = function() {
        var newComment = new Comment();
        newComment.comment = $scope.comment;
        newComment.tweetId = $routeParams.id;
        newComment.$save(function(comment) {}, function(err) {
            console.log(err);
        });
    }
    socket.on('comment' + $routeParams.id, function(comment) {
        $scope.comments.push(comment);
    })
});
/*A controller for tweets*/
app.controller('TweetController', function($http, $routeParams, $scope, Tweet, socket) {
    $scope.tweets = [];
    $scope.showEditBox = [];
    $scope.TweetObject = {};
    $scope.tweets = Tweet.query(function() {
        for (var i in $scope.tweets) {
            $scope.showEditBox.push(false);
        }
    });
    /*To create new tweets*/
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
    $scope.updatePost = function(tweet, index) {
            var updateTweet = new Tweet();
            updateTweet.tweet = $scope.editTweet;
            Tweet.update({
                id: tweet._id
            }, tweet, function(tweet) {
                console.log(tweet);
                $scope.showEditBoxfunction(index);
            }, function(err) {
                console.log(err);
            })
        }
        /*to delete a tweet*/
    $scope.deletePost = function(tweetId) {
            Tweet.delete({
                id: tweetId
            }, function(data) {
                /*$scope.tweets.splice(index, 1);*/
                $scope.tweets = $scope.tweets.filter(function(item) {
                    return item._id !== tweetId;
                });
            });
        }
        /*Changing the state of the edit box*/
    $scope.showEditBoxfunction = function(index) {
            $scope.showEditBox[index] = !$scope.showEditBox[index];
        }
        /*socket listining to the deleted tweets*/
    socket.on('tweetDeleted', function(tweetId) {
        $scope.tweets = $scope.tweets.filter(function(item) {
            return item._id !== tweetId;
        });
    });
    /*socket listining to the new tweets*/
    socket.on('tweet', function(tweet) {
        $scope.tweets.unshift(tweet);
    });
});
app.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/html/home.html',
        controller: 'TweetController'
    }).when('/tweet/:id', {
        templateUrl: '/html/tweet.html',
        controller: 'CommentController'
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