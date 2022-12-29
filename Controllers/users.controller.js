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
	res.json([{ message: req.user }])
}

module.exports = {
	getAllUsers,
	currentUser,
}
