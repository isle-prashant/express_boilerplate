/**
 * Created by PRASHANT on 08-04-2016.
 */
var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    id: {type: String, required: true, index: {unique: true}},
    name: {type: String, required: true},
    gender: {type: String, required: true},
    profile_pic: {type: String, required: true},
    created_at: {type: Date, default: Date.now()}
});
module.exports = mongoose.model('User', userSchema);
