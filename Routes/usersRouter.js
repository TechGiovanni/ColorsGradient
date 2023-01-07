const usersRouter = require('express').Router()
const passport = require('passport')

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
// @Explanation  Note how I'm just using passport as middleware, then move on to the next function, which checks for the user. It should have received it from the previous function.
usersRouter.post(
	'/login',
	loginUser,
	passport.authenticate('local'),
	(req, res) => {
		console.log('The Req User that just logged in', req.user)
		if (!req.user) {
			return
		}
		const date = new Date()
		console.log(`User ID:${req.user.id} logged in at ${date}`)
		// Respond to the front end with the user that logged in
		res.json(req.user)
	}
)

// (req, user, info) => {
//   req.logIn(user, (err) => {
//     if (err) {
//       res.json({ msg: err })
//     }
//     console.log('The User', user)
//     return res.json(user)
//   })
// }

// function (req, res) {
// 	// console.log('Passport Req Body', res)
// 	res.redirect('https://localhost:3001/dashboard')
// }

// req.login(user, function(err) {
//   if (err) { return next(err); }
//   return res.redirect('/users/' + req.user.username);
// });

// @Desc    get the current User that's logged in
// @Method  GET
// @Route   /api/v1/users/current
usersRouter.get('/current', currentUser)

module.exports = usersRouter

// {
//   successRedirect: 'https://localhost:3001/dashboard',
//   failureRedirect: '/',
//   session: true,
//   failWithError: true,
// }
