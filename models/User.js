const {Schema, model, Types} = require('mongoose')

const User = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    userInfo: {
        nameSurname: {type: String, default: ''},
        description: {type: String, default: ''},
        age: {type: Number, default: null},
        hobbies: {type: String, default: ''}
    },
    posts: [{ type: {}, ref: 'Post'}],
    roles: [{type: String, ref: 'Role'}],
})

module.exports = model('User', User)