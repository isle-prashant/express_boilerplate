var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
/* GET users listing. */
var sendUserData = function(res, user) {
    var ob = {};
    ob.user = {};
    ob.user.id = user._id;
    ob.user.email = user.email;
    ob.user.username = user.username;
    res.json(ob);
};
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
router.get('/logout', function(req, res) {
    req.logout();
    res.json({
        success: 'successfully signed out'
    });
});
module.exports = router;