
/**
 * Created by PRASHANT on 04-04-2016.
 */
var User = require('../models/user');
var FacebookStrategy = require('passport-facebook').Strategy;
module.exports = {
    deserialize: function(id, done) {
        User.findOne({
            _id: id
        }, function(err, user) {
            done(err, user);
        })
    },
    serialize: function(user, done) {
        done(null, user._id);
    },
    facebookStrategy: new FacebookStrategy({
        clientID: '1672476879671974 ',
        clientSecret: '5a8644c97e7c3c248cfd5ce1c47bdddf',
        callbackURL: "http://172.28.176.97:3000/api/users/facebook/callback",
        profileFields: ['id', 'displayName', 'picture.type(large)', 'emails', 'gender', 'about', 'bio']
    }, function(accessToken, refreshToken, profile, cb) {
        var error = {error: 'Could not log in'};
        User.findOne({id: profile.id}, function(err, user){

            if(err){
                return res.send(error);
            }

            if(user){
                var sendUser = {};
                sendUser.type = 'Old user';
                sendUser.user = user;
                return cb(sendUser);
            }

            var newUser = new User();
            newUser.id = profile.id;
            newUser.name = profile.displayName;
            newUser.gender = profile.gender;
            newUser.profile_pic = profile.photos[0].value;
            newUser.save(function(err, user){
                if(err || !user){
                    console.log(err);
                    return cb(error);
                }

                var sendUser = {};
                sendUser.type = 'New user';
                sendUser.user = user;
                return cb(sendUser);

            });

        });

    })
};