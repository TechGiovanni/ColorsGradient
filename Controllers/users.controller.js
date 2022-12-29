const UserModel = require('../Models/user.model')

// @Desc     Display all Users
// @Method   GET
// @Route    /api/v1/users
async function getAllUsers(req, res) {
	res.json(await UserModel.find({}))
}

// @Desc     Display the current User
// @Method   GET
// @Route    /api/v1/users/current
const currentUser = (req, res) => {
	res.json([req.user])
}

// TODO Email and Password Login Start

// @Desc    login a user with email and password
// @Method  POST
// @Route   /api/v1/users/login
const loginUser = (req, res) => {
	console.log('Request data', req.body)
	res.json({ message: 'hello' })
}

// @Desc    register a user with email and password
// @Method  POST
// @Route   /api/v1/users
const registerUser = (req, res) => {
	console.log('Request data', req.body)
	res.status(201).json(req.body)
}
// TODO Email and Password Login End

module.exports = {
	getAllUsers,
	currentUser,
	loginUser,
	registerUser,
}
