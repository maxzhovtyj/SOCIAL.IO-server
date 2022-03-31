const User = require('./models/User')
const Role = require('./models/Role')
const Post = require('./models/Post')


class apiController {
    async getUserInfo(req, res) {
        try {
            const params = req.query
            const user = await User.findById(params.id)
            if (!user) {
                return res.status(400).json({message: "User has not been found..."})
            }
            return res.json(user.userInfo)
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Something went wrong"})
        }
    }

    async getAllUsersInfo(req, res) {
        try {
            const users = await User.find()
            const usersInfo = users.map((item) => {
                return item?.userInfo
            })
            res.json(usersInfo)
        } catch (e) {
            console.log(e)
        }
    }

    async getFriendshipRequests(req, res) {
        try {
            const {id} = req.body
            const user = await User.findById(id)
            if (!user) {
                return res.status(400).json({message: "User was not found"})
            }

            return res.json(user.friendsRequests)
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

    async sendFriendshipRequest(req, res) {
        try {
            const {newFriendId} = req.query
            const {myUserId} = req.body
            const newFriendUser = await User.findById(newFriendId)
            const myUser = await User.findById(myUserId)
            if (!user) {
                return res.status(400).json({message: "User has not been found..."})
            }
            const friendshipStatus = newFriendUser.friends.indexOf(myUser)
            if (friendshipStatus === -1) return res.status(400).json({message: "You are already friends"})
            await newFriendUser.friendsRequests.push(myUserId)
            await newFriendUser.save()

            return res.status(200).json({message: "Friendship request send"})
        } catch (e) {
            console.log(e)
            return res.status(400).json("Something went wrong")
        }
    }

    async acceptFriendshipRequest(req, res) {
        try {
            const {myId, newFriendId} = req.body

            const user = await User.findById(myId)
            const newFriend = await User.findById(newFriendId)

            if (!user || !newFriend) {
                return res.status(400).json({message: "User has not been found..."})
            }

            await user.friends.push(newFriendId)
            const newFriendIndex = await user.friends.indexOf(newFriendId)
            if (newFriendIndex === -1) return res.status(400).json("No such friend request")
            await user.friendsRequests.splice(newFriendIndex, 1)
            await user.save()

            await newFriend.friends.push(myId)
            const myIndex = await newFriend.friends.indexOf(myId)
            if (myIndex === -1) return res.status(400).json("No such friend request")
            await newFriend.friendsRequests.splice(myIndex, 1)
            await newFriend.save()


            return res.status(200).json({message: "Friendship request accepted"})
        } catch (e) {
            console.log(e)
            return res.status(400).json("Something went wrong")
        }
    }

}

module.exports = new apiController()