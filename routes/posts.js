var express = require('express');
var router = express.Router();
var Tweet = require('../models/tweet');
/* GET users listing. */

var ifLoggedIn = function (req, res, next) {
    if (!req.user) {
        res.send("Not logged in \n please login first.");
        return;
    }
    next();
};
var ifowns = function (req, res, next) {

    Tweet.findOne({_id: req.params.id}, function (err, tweet) {
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
router.get('/', function (req, res, next) {
    Tweet.find(function (err, tweets) {
        if (err) {
            return next();
        }
        res.send(tweets);
    });
});

router.post('/', ifLoggedIn, function (req, res, next) {
    var newTweet = new Tweet();
    newTweet.tweet = req.body.tweet;
    newTweet.creator = req.user._id;
    newTweet.save(function (err, tweet) {
        if (err) {
            res.send(err);
            return next();
        }
        res.send(tweet);
    });
});

router.delete('/:id', ifLoggedIn, ifowns, function (req, res, next) {

    Tweet.findByIdAndRemove(req.params.id, function (err, tweet) {
        if (err) {
            res.send(err);
            return next();
        }
        res.send(tweet);
    });
});

router.put('/:id', ifLoggedIn, ifowns, function (req, res, next) {
    var newTweet = {};
    newTweet.tweet = req.body.tweet;
    Tweet.findByIdAndUpdate(req.params.id, newTweet, function (err, tweet) {
        if (err) {
            res.send(err);
            return next();
        }
        res.send(tweet);
    });
});

module.exports = router;
