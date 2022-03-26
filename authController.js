const User = require('./models/User')
const Role = require('./models/Role')

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
            const user = new User({username, password: hashPassword, roles: [userRole.value]})
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
            return res.json({token})

        } catch (e) {
            return res.status(400).json('Something went wrong (login)...')
        }
    }

    async addNewPost(req, res) {
        try {
            const {username, post} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: "User has not been found..."})
            }
            console.log(post)
            user.posts.push(post)
            user.save()
            return res.json('Post has been saved')
        } catch (e) {
            console.log(e)
        }
    }

    async getUserPosts(req, res) {
        try {
            const {username} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: "User has not been found..."})
            }
            res.json(user.posts)
        } catch (e) {
            console.log(e)
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new authController()