const {Schema, model, Types} = require('mongoose')

const User = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    friends: [{type: Types.ObjectId, required: true, ref: 'User'}],
    friendsRequests: [{type: Types.ObjectId, required: true, ref: 'User'}],
    userInfo: {
        nameSurname: {type: String, default: ''},
        userId: {type: Types.ObjectId},
        description: {type: String, default: ''},
        age: {type: Number, default: null},
        hobbies: {type: String, default: ''}
    },
    posts: [{ type: {}, ref: 'Post'}],
    roles: [{type: String, ref: 'Role'}],
})

module.exports = model('User', User)