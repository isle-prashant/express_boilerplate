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
    var ifCombinedowns = function(req, res, next) {
            Comment.findOne({
                _id: req.params.id
            }).populate({
                path: 'tweetId',
                select: 'creatorId'
            }).exec(function(err, comment) {
                if (err) {
                    return res.send({
                        error: err
                    });
                    console.log(err);
                }
                if ((comment.userId == req.user._id.toString()) || (comment.tweetId.creatorId == req.user._id.toString())) {
                    return next();
                } else {
                    return res.send("You are not Authorised!!");
                    console.log("You are not Authorised!!");
                }
            });
        }
        /*to check if the current user onws the post or not*/
    var ifowns = function(req, res, next) {
        Comment.findOne({
            _id: req.params.id
        }, function(err, comment) {
            if (err || !comment) {
                return res.send("error");
            }
            if (comment.userId != req.user._id.toString()) {
                return res.send("You are not Authorised!!");
            }
            return next();
        });
    };
    /*To get all the comments on a tweet*/
    router.get('/:id', ifLoggedIn, function(req, res, next) {
        Comment.find({
            tweetId: req.params.id
        }).populate({
            path: 'userId',
            select: 'name id'
        }).exec(function(err, comment) {
            if (err) {
                return res.send({
                    error: err
                });
            }
            return res.send(comment);
        });
    });
    /*to create a comment on a post*/
    router.post('/', ifLoggedIn, function(req, res, next) {
        var newComment = new Comment();
        newComment.comment = req.body.comment;
        newComment.tweetId = req.body.tweetId;
        newComment.userId = req.user._id;
        newComment.save(function(err, comment) {
            if (err) {
                res.send(err);
                return next();
            }
            Tweet.findOne({
                _id: comment.tweetId
            }, function(err, tweet) {
                if (err) {
                    return res.send(err);
                }
                tweet.comments.push(comment._id);
                tweet.save(function(err, tweet) {
                    comment.userId = req.user;
                    io.emit('comment' + comment.tweetId, comment)
                    res.send(comment)
                });
            });
        });
    });
    /*to delete a given comment by its id*/
    router.delete('/:id', ifLoggedIn, ifCombinedowns, function(req, res, next) {
        Comment.findByIdAndRemove(req.params.id, function(err, comment) {
            if (err) {
                return res.send(err);
            }
            Tweet.findOne({
                _id: comment.tweetId
            }, function(err, tweet) {
                if (err) {
                    return res.send(err);
                }
                tweet.comments.pull(comment._id);
                tweet.save(function(err, tweet) {
                    io.emit('commentDeleted' + comment.tweetId, comment._id);
                    res.send(comment);
                });
            });
        });
    });
    /*To update a comment*/
    router.put('/:id', ifLoggedIn, ifowns, function(req, res, next) {
        var newComment = {};
        newComment.comment = req.body.comment;
        Comment.findByIdAndUpdate(req.params.id, newComment, function(err, comment) {
            if (err) {
                res.send(err);
                return next();
            }
            res.send(comment);
        });
    });
    return router;
}