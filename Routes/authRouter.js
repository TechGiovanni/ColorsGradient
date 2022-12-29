const authRouter = require('express').Router()
const passport = require('passport')
const UserModel = require('../Models/user.model')

const {
	LoginUsers,
	logoutUser,
	googleCallBack,
	googleLogin,
	failedAuthDisplay,
} = require('../Controllers/auth.controller')

// @Desc    Login a user with email
// @Route   /api/v1/auth/loginUser
authRouter.get('/loginUser', LoginUsers)
// authsRouter.post('/loginUser', (req, res) => {})
// authsRouter.get('/registerUser', (req, res) => {})
// authsRouter.post('/registerUser', (req, res) => {})

//
//
//
//
//
//
// ** GOOGLE LOGIN SECTION START
// @Desc    Starts the google Flow
// @Route   /api/v1/auth/google
authRouter.get('/google', googleLogin)

// @Desc    Google Callback
// @Route  /api/v1/auth/google/callback
authRouter.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/failure',
		successRedirect: '/dashboard',
		session: true,
	}),
	googleCallBack
)
// ** GOOGLE LOGIN SECTION END

// ?? ERROR AND LOGOUT USERS
// @Desc    Log User out of the application
// @Route   /api/v1/auth/logout
authRouter.get('/logout', logoutUser)

// @Desc    Log User out of the application
// @Route   /api/v1/auth/failure
authRouter.get('/failure', failedAuthDisplay)

module.exports = authRouter
