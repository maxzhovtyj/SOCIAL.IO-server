const Router = require('express')
const router = new Router()

const controller = require('./apiController')

router.get('/users', controller.getUsers)
router.get('/userInfo', controller.getUserInfo)
router.get('/allUsersInfo', controller.getAllUsersInfo)
router.get('/friendshipRequests', controller.getFriendshipRequests)
router.post('/sendFriendshipRequest', controller.sendFriendshipRequest)
router.post('/acceptFriendshipRequest', controller.acceptFriendshipRequest)

module.exports = router