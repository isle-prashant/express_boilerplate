var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

/* GET users listing. */

var sendUserData = function (res, user) {
    var ob = {};
    ob.user = {};
    ob.user.id = user._id;
    ob.user.email = user.email;
    ob.user.username = user.username;
    res.json(ob);
};

router.get('/', function(req, res, next) {
 User.find(function(err, users){
     if(err){
         return res.send(err);
     }
     res.send(users);
 });
});


router.post('/login', function (req, res) {
    passport.authenticate('login', function (err, user) {
        if (!user) {
            res.json({error: err});
        } else {
            req.logIn(user, function (err) { // When using authenticate manually log in manually
                return sendUserData(res, user);
            });
        }
    })(req, res);
});

router.post('/signup', function (req, res, next) {

    passport.authenticate('signup', function (err, user) {
        if (err) {
            if ((err.message + '').indexOf('duplicate') > -1) {
                res.json({error: 'email exists'});
            } else {
                res.json({error: err.message});
            }
            console.log(err);
        } else {
            sendUserData(res, user);
        }
    })(req, res, next);

});

router.get('/logout', function (req, res) {
    req.logout();
    res.json({success: 'successfully signed out'});
});

module.exports = router;
