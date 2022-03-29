const mongoose = require('mongoose');
const {model} = require("mongoose");
const {Schema, Types} = mongoose;

const Post = new Schema({
    authorId: {type: Types.ObjectId, ref: 'User', required: true},
    authorName: {type: String, required: true},
    text: {type: String, required: true},
    likes: {type: Number, default: 0}
});

module.exports = model('Post', Post)