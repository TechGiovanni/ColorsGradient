const UserModel = require('../Models/user.model')
const passport = require('passport')

// TODO Email and Password Login Start

// @Desc     Display the current User
// @Method   GET
// @Route    /api/v1/auth/loginUser
const LoginUsers = (req, res) => {
	res.json()
}

// @Desc     verify that the user is in the database
// @Method   POST
// @Route    /api/v1/auth/loginUser
const LoginUser = (req, res) => {
	res.json()
}
// TODO Email and Password Login End
//
//
//
//
// ** GOOGLE LOGIN SECTION START
// @Desc     Logs the user into the application
// @Method   GET
// @Route    /api/v1/auth/google
const googleLogin = passport.authenticate('google', {
	scope: ['email', 'profile'],
})

//
// @Desc     redirect to dashboard, Google callback
// @Method   GET
// @Route    /api/v1/auth/google/callback
const googleCallBack = (req, res) => {
	console.log('Google called us back')
}
// ** GOOGLE LOGIN SECTION END

// ?? ERROR AND LOGOUT USERS
// @Desc    Logging Out a User from the application
// @Method  GET
// @Route   /api/v1/auth/logout
const logoutUser = (req, res) => {
	req.logout() // removes req.user and clears any logged in session
	return res.redirect('/')
}

// Display View If authentication with google fails
const failedAuthDisplay = (req, res) => {
	res.send('Failed to log in.')
	// res.send("<button><a href='/auth/logout'>logout</a></button>")
}

module.exports = {
	LoginUsers,
	googleLogin,
	googleCallBack,
	logoutUser,
	failedAuthDisplay,
}
