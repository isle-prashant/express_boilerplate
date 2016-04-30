var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find(function(err, users) {
        if (err) {
            return res.send(err);
        }
        res.send(users);
    });
});
router.get('/auth/facebook', passport.authenticate('facebook'));
/* Handle callback requests */
router.get('/facebook/callback', function(req, res, next) {
    console.log('Enter');
    passport.authenticate('facebook', function(user) {
        // Checking if user object is present
        if (user.user) {
            req.logIn(user.user, function(err) {});
        }
        res.redirect('/');
    })(req, res, next);
});
/*to be removed later*/
router.delete('/', function(req, res) {
    User.remove({}, function(err, users) {
        if (!users || err) {
            return res.send(err);
        }
        return res.send(err);
    });
});
/*To get the current user*/
router.get('/currentUser', function(req, res) {
    if (!req.user) {
        return res.send({
            error: "No user logged in"
        });
    }
    return res.send(req.user);
});
/*To logout a user*/
router.get('/logout', function(req, res) {
    req.logout();
    res.json({
        success: 'successfully signed out'
    });
});
router.get('/mylogin', function(req, res) {
    User.findOne({
        _id: '572292626d8eac97117054b9'
    }, function(err, user) {
        if (err || !user) {
            return res.send('False');
        }
        req.logIn(user, function(err) {});
        res.json(req.user);
    });
});
router.delete('/:id', function(req, res, next) {
    User.findByIdAndRemove(req.params.id, function(err, comment) {
        if (err) {
            return res.send(err);
        }
    });
});
router.get('/clogin', function(req, res) {
    User.findOne({
        _id: '572491d2fd8b532d0f9610a8'
    }, function(err, user) {
        if (err || !user) {
            return res.send('False');
        }
        req.logIn(user, function(err) {});
        res.json(req.user);
    });
});
module.exports = router;