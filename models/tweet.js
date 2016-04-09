/**
 * Created by PRASHANT on 08-04-2016.
 */
var mongoose = require ('mongoose');
var postSchema =  new mongoose.Schema({
    tweet: {type: String, required: [true, ' field is required']},
    creator: {type: mongoose.Schema.ObjectId, required: true },
    updated_at: {type: Date, default: Date.now}


});

module.exports = mongoose.model('Post', postSchema);
//