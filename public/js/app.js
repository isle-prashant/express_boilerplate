/**
 * Created by PRASHANT on 10-04-2016.
 */
var app = angular.module('myApp', ['ngResource', 'ngRoute']);

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.factory('Tweet', function ($resource) {
        return $resource('tweets/:id', null, {
            'update': {method: 'PUT'}
        });
    }
);

app.factory('Comment', function ($resource) {
        return $resource('tweets/:id/comments/:cid', null, {
            'update': {method: 'PUT'}
        });
    }
);

app.controller('TweetController', function ($http, Tweet)  {
    var _this = this;
    _this.tweets = [];
    _this.postObjectTweet = {};
    _this.showTweetFlag = [];
    _this.showEditForm = [];
    _this.postErrorMessage = '';
    _this.updateErrorMessage = [];

    _this.tweets = Tweet.query(function () {
        for (var i in _this.tweets) {
            _this.showTweetFlag.push(true);
            _this.showEditForm.push(false);
        }
        _this.tweets = _this.tweets.reverse();
    });

    _this.changeEditFormVisibility = function (index) {
        _this.showEditForm[index] = !_this.showEditForm[index];
    };


    _this.updateTweet = function (index) {

        Tweet.update({id: _this.tweets[index]._id}, _this.tweets[index], function (tweet) {
            if (tweet.error) {
                _this.updateErrorMessage[index] = tweet.error;
            } else {
                _this.showEditForm[index] = false;
            }
            console.log(tweet);
        }, function (err) {
        });

    };

    _this.deleteTweet = function (index) {
        Tweet.remove({id: _this.tweets[index]._id}, function (tweet, err) {
            if(tweet.error){

            }else{
                _this.showTweetFlag[index] = false;
            }
        });

    };

    this.postTweet = function () {

        var newTweet = new Tweet();
        newTweet.title = _this.postObjectTweet.title;
        newTweet.body = _this.postObjectTweet.body;
        newTweet.$save(function (tweet) {
            // called when saved successfully or validation error

            if (tweet.error) {
                _this.postErrorMessage = tweet.error;
            } else {
                _this.tweets.unshift(tweet);
                _this.showTweetFlag.unshift(true);
                _this.postObjectTweet = {};
                _this.showEditForm.unshift(false);
                _this.updateErrorMessage.unshift('');
                _this.postErrorMessage = '';
            }

        }, function (err) {
            // called when error arrives
            console.log(err);
        });

    }
});

app.controller('SingleTweetController', function ($routeParams, $http, Tweet, Comment) {
    var _this = this;
    _this.tweetId = $routeParams.tweetId;
    _this.tweet = Tweet.get({id: _this.tweetId}, null);
    _this.user = {};
    _this.comments_hide = [];
    _this.isLoggedIn = false;

    _this.comments = Comment.query({id: _this.tweetId},function () {
        _this.comments = _this.comments.reverse();
        for(item in _this.comments){
            _this.comments_hide.push(false);
        }
    });

    $http.get('/account/user', null, null).then(function (response) {
        if (response.data.id) {
            _this.isLoggedIn = true;
            _this.user = response.data;
        }
    });

    _this.deleteComment = function(index){
        Comment.remove({id: _this.tweetId, cid: _this.comments[index]._id}, function(err, comment){
            if(comment.error){

            }else{
                _this.comments_hide[index] = true;
            }
        });
    }

    _this.comment = function(){
        var comment = new Comment();
        comment.comment = _this.newComment;
        comment.$save({id: _this.tweetId}, function(comment){
            if(comment.error){

            }else{
                _this.comments.unshift(comment);
                _this.comments_hide.unshift(false);
            }
            _this.newComment = '';
        });
    }

});

app.controller('NavbarController', function ($http) {
    var _this = this;
    _this.isLoggedIn = false;
    _this.userName = '';


    $http.get('/account/user', null, null).then(function (response) {
        if (response.data.id) {
            _this.isLoggedIn = true;
            _this.userName = response.data.username;
        }
    });
});

app.controller('LoginController', function ($http) {
    var _this = this;
    _this.errorMesage = '';
    _this.loginObject = {};

    _this.doLogin = function () {
        _this.errorMesage = '';
        console.log(_this.loginObject);
        $http.post('/account/login', _this.loginObject, null).then(function(){
            window.location = '/';
        }, function(){
            _this.errorMesage = 'Username or password incorrect'
        });

    }


});

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/html/index_tweets.html',
            controller: 'TweetController',
            controllerAs: 'tweet'
        })
        .when('/login', {
            templateUrl: '/html/login.html',
            controller: 'LoginController',
            controllerAs: 'login'
        })
        .when('/:tweetId', {
            templateUrl: '/html/show_tweet.html',
            controller: 'SingleTweetController',
            controllerAs: 'single'
        })
        .otherwise({
            templateUrl: '/html/index_tweets.html',
            controller: 'TweetController',
            controllerAs: 'tweet'
        });

    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});