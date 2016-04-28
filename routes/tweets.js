module.exports = function(io) {
    var express = require('express');
    var router = express.Router();
    var Tweet = require('../models/tweet');
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
            if (tweet.creator.toString() != req.user._id.toString()) {
                return res.send("You are not Authorised!!");
            }
            return next();
        });
    };
    /*to get all the posts*/
    router.get('/', function(req, res, next) {
        Tweet.find({}).sort({
            _id: -1
        }).populate({
            path: 'creatorId',
            select: 'name id'
        }).exec(function(err, tweets) {
            if (err) {
                return next();
            }
            res.send(tweets);
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
            res.send(tweet);
        });
    });
    /*to be removed later*/
    router.delete('/', function(req, res) {
        Tweet.remove({}, function(err, users) {
            if (!users || err) {
                return res.send(err);
            }
            return res.send(err);
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