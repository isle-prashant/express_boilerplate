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
        Comment.findOne({
            _id: req.params.id
        }, function(err, comment) {
            if (err || !comment) {
                return res.send("error");
            }
            console.log("UserId" + req.user._id + "creatorId", tweet.creator);
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
            comment.userId = req.user;
            io.emit('comment'+comment.tweetId, comment)
            res.send(comment);
        });
    });
    /*to delete a given post by its id*/
    router.delete('/:id', ifLoggedIn, ifowns, function(req, res, next) {
        Comment.findByIdAndRemove(req.params.id, function(err, comment) {
            if (err) {
                return res.send(err);
            }
            res.send(comment);
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