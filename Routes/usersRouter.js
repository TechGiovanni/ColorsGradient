const usersRouter = require('express').Router()

const {
	getAllUsers,
	currentUser,
	loginUser,
	registerUser,
} = require('../Controllers/users.controller')

// @Desc    get all Users
// @Method  GET
// @Route   /api/v1/users
usersRouter.get('/', getAllUsers)

// @Desc    register/create a user with email and password
// @Method  POST
// @Route   /api/v1/users
usersRouter.post('/', registerUser)

// @Desc    login a user with email and password
// @Method  POST
// @Route   /api/v1/users/login
usersRouter.post('/login', loginUser)

// @Desc    get the current User that's logged in
// @Method  GET
// @Route   /api/v1/users/current
usersRouter.get('/current', currentUser)

module.exports = usersRouter
