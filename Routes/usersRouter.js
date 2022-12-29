const usersRouter = require('express').Router()

const { getAllUsers, currentUser } = require('../Controllers/users.controller')

// userRouter.get('/api/v1/users', async (req, res) => {
// 	res.json(await UserModel.find({}))
// })

usersRouter.get('/', getAllUsers)
usersRouter.get('/current', currentUser)

module.exports = usersRouter
