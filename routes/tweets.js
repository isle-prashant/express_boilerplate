module.exports = function(io) {
    var express = require('express');
    var router = express.Router();
    var Tweet = require('../models/tweet');
    var Comment = require('../models/comment');
    /* GET users listing. */
    var ifLoggedIn = function(req, res, next) {
        if (!req.user) {
            res.send("Not logged in \n please login first.");
            return;
        }
        next();
    };
    /*to check if the current user onws the post or not*/
    var ifowns = function(req, res, next) {
        Tweet.findOne({
            _id: req.params.id
        }, function(err, tweet) {
            if (err || !tweet) {
                return res.send("error");
            }
            console.log("UserId" + req.user._id + "creatorId", tweet.creator);
            if (tweet.creatorId != req.user._id.toString()) {
                return res.send("You are not Authorised!!");
            }
            return next();
        });
    };
    /*to get all the posts*/
    router.get('/', function(req, res, next) {
        var search = {};
        if (req.query.tid) {
            search = {
                _id: {
                    $lt: req.query.tid
                }
            }
        }
        Tweet.find(search).sort({
            _id: -1
        }).populate({
            path: 'creatorId',
            select: 'name id'
        }).limit(10).exec(function(err, tweets) {
            if (err) {
                return next();
            }
            res.send(tweets);
        });
    });
    /*To get a tweet by its id*/
    router.get('/:id', ifLoggedIn, function(req, res, next) {
        Tweet.findOne({
            _id: req.params.id
        }).populate({
            path: 'creatorId',
            select: 'name id'
        }).exec(function(err, tweet) {
            if (err) {
                return res.send({
                    error: err
                });
            }
            return res.send(tweet);
        });
    });
    /*to create new posts*/
    router.post('/', ifLoggedIn, function(req, res, next) {
        var newTweet = new Tweet();
        newTweet.tweet = req.body.tweet;
        newTweet.creatorId = req.user._id;
        newTweet.save(function(err, tweet) {
            if (err) {
                res.send(err);
                return next();
            }
            tweet.creatorId = req.user;
            io.emit('tweet', tweet);
            console.log(tweet);
            res.send(tweet);
        });
    });
    /*to delete a given post by its id*/
    router.delete('/:id', ifLoggedIn, ifowns, function(req, res, next) {
        Tweet.findByIdAndRemove(req.params.id, function(err, tweet) {
            if (err) {
                res.send(err);
                return next();
            }
            console.log(tweet._id);
            Comment.findByIdAndRemove({
                tweetId: req.params.id
            }, function(err, comment) {
                if (err) {
                    return res.send(err);
                }
            });
            io.emit('tweetDeleted', tweet._id);
            res.send(tweet);
        });
    });
    /*to be removed later*/
    router.delete('/', function(req, res) {
        Tweet.remove({}, function(err, tweet) {
            if (!users || err) {
                return res.send(err);
            }
            return res.send(tweet);
        });
    });
    /*To update a tweet*/
    router.put('/:id', ifLoggedIn, ifowns, function(req, res, next) {
        var newTweet = {};
        newTweet.tweet = req.body.tweet;
        Tweet.findByIdAndUpdate(req.params.id, newTweet, function(err, tweet) {
            if (err) {
                res.send(err);
                return next();
            }
            res.send(tweet);
        });
    });
    return router;
}