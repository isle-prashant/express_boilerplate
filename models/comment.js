/**
 * Created by PRASHANT on 08-04-2016.
 */
var mongoose = require ('mongoose');
var commentSchema =  new mongoose.Schema({
    comment: {type: String, required: [true, ' field is required']},
    userId: {type: String, required: true, ref: 'User' },
    tweetId: {type: String, required: true, ref: 'Post'},
    created_at: {type: Date, default: Date.now}


});

module.exports = mongoose.model('Comment', commentSchema);
//