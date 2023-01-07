const authRouter = require('express').Router()
const passport = require('passport')

const {
	LoginUsers,
	logoutUser,
	// googleCallBack,
	googleLogin,
	failedAuthDisplay,
} = require('../Controllers/auth.controller')

// ?? GOOGLE LOGIN SECTION START
// @Desc    Starts the google Flow
// @Route   /api/v1/auth/google
authRouter.get('/google', googleLogin)

// @Desc    Google Callback
// @Route  /api/v1/auth/google/callback
// authRouter.get(
// 	'/google/callback',
// 	passport.authenticate('google', {
// 		failureRedirect: '/api/v1/auth/failure',
// 		successRedirect: '/dashboard',
// 		session: true,
// 	}),
// 	googleCallBack
// )
// ** GOOGLE LOGIN SECTION END

// ?? ERROR AND LOGOUT USERS
// @Desc    Log User out of the application
// @Route   /api/v1/auth/logout
authRouter.get('/logout', logoutUser)

// @Desc    Log User out of the application
// @Route   /api/v1/auth/failure
authRouter.get('/failure', failedAuthDisplay)

module.exports = authRouter
