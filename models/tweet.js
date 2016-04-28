/**
 * Created by PRASHANT on 08-04-2016.
 */
var mongoose = require ('mongoose');
var postSchema =  new mongoose.Schema({
    tweet: {type: String, required: [true, ' field is required']},
    creatorId: {type: String, required: true, ref: 'User' },
    updated_at: {type: Date, default: Date.now}


});

module.exports = mongoose.model('Post', postSchema);
//