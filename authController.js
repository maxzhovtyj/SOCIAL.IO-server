const User = require('./models/User')
const Role = require('./models/Role')
const Post = require('./models/Post')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {validationResult} = require('express-validator')
const {secret} = require('./config')

const generateAccessToken = (id, roles) => {
    const payload = {id, roles}
    return jwt.sign(payload, secret, {expiresIn: '24h'})
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Something went wrong during the registration", errors})
            }
            const {username, password} = req.body
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: "Such user already exists"})
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({value: "USER"})
            const user = new User({username, password: hashPassword, friends: [], userInfo: {nameSurname: username}, roles: [userRole.value]})
            await user.save()

            user.userInfo.userId = await user._id
            await user.save()
            return res.json({message: "User has been successfully registered"})
        } catch (e) {
            console.log(e)
            res.status(400).json('Something went wrong (registration)')
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: `User has not been found...`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: "Wrong password, try again..."})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token, userId: user._id})
        } catch (e) {
            return res.status(400).json('Something went wrong (login)...')
        }
    }

    async addNewPost(req, res) {
        try {
            const post = req.body
            const user = await User.findById(post.authorId)
            console.log(user)
            if (!user) {
                return res.status(400).json({message: "User has not been found..."})
            }
            const newPost = new Post({
                authorId: post.authorId,
                authorName: user.userInfo.nameSurname,
                text: post.text
            })
            await newPost.save()

            await user.posts.push(newPost)
            await user.save()
            return res.json('Post has been saved')
        } catch (e) {
            console.log(e)
        }
    }

    async getUserPosts(req, res) {
        try {
            const params = req.query
            const user = await User.findById(params.id)
            if (!user) {
                return res.status(400).json({message: "User has not been found..."})
            }
            return res.json(user.posts)
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Something went wrong"})
        }
    }

    async getAllPosts(req, res) {
        try {
            const posts = await Post.find()
            res.json(posts)
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: 'Something went wrong'})
        }
    }
}

module.exports = new authController()