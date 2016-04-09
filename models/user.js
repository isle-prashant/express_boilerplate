/**
 * Created by PRASHANT on 08-04-2016.
 */
var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    created_at: {type: Date, default: Date.now}

});
module.exports = mongoose.model('User', userSchema);
