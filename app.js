const express = require('express')
const app = express()
// require('colors')
const cors = require('cors')
const path = require('path') // for react the build middleware
const morgan = require('morgan')
const helmet = require('helmet')
const passport = require('passport')
const { Strategy } = require('passport-google-oauth20')
const {
	CLIENT_ID,
	CLIENT_SECRET,
	COOKIE_KEY_1,
	COOKIE_KEY_2,
} = require('./Utils/config')
const cookieSession = require('cookie-session')
const UserModel = require('./Models/user.model')

const usersRouter = require('./Routes/usersRouter')
const colorsRouter = require('./Routes/colorsRouter')
const authRouter = require('./Routes/authRouter')
const userModel = require('./Models/user.model')

async function verifyCallback(accessToken, refreshToken, profile, done) {
	console.log('google profile', profile.emails[0].value)
	console.log('accessToken', accessToken)
	// This is where we could also save the user profile to the database
	// User.findOrCreate({ googleId: profile.id }, function (err, user) {
	// return cb(err, user);
	// });
	// done(null, profile)
	// Adding the user to the Mongo database
	const newUser = {
		name: profile.displayName,
		email: profile.emails[0].value,
		googleId: profile.id,
		firstName: profile.name.givenName,
		lastName: profile.name.familyName,
		image: profile.photos[0].value,
	} // this will give us the new user

	try {
		// we want to try to store the user.
		let user = await UserModel.findOne({ googleId: profile.id }) // to see if that user exists already

		let userEmail = await UserModel.findOne({ email: profile.emails[0].value })

		if (user || userEmail) {
			console.log('user already signed up!!!')
			done(null, user)
		} else {
			// if there is no user, then we want to create one.
			// then call done with null and our new user
			user = await UserModel.create(newUser)
			done(null, user)
		}
	} catch (err) {
		console.error('Signup Error', err)
	}
}

// calls the verify callback function above
passport.use(
	new Strategy(
		{
			clientID: CLIENT_ID,
			clientSecret: CLIENT_SECRET,
			callbackURL: '/api/v1/auth/google/callback',
		},
		verifyCallback
	)
)

// Saving the session to the cookie
passport.serializeUser((user, done) => {
	done(null, user.id)
})

// Reading the session from the cookie
passport.deserializeUser((id, done) => {
	UserModel.findById(id).then((user) => {
		done(null, user)
	})
	// done(null, id)
})

// Middleware - Cookie session to 30 days
app.use(helmet())
app.use(
	cookieSession({
		name: 'session',
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: [COOKIE_KEY_1, COOKIE_KEY_2],
	})
)

app.use(passport.initialize())
app.use(passport.session())
app.use(cors({ origin: 'http://localhost:3000' }))

app.use(morgan('combined'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))

// TODO API SECTION START

// ** MAIN API ROUTES SECTION START
// User Routes
app.use('/api/v1/users', usersRouter)
// Color Routes
app.use('/api/v1/colors', colorsRouter)
// Social Signup & Login with google
app.use('/api/v1/auth', authRouter)
//
// ** MAIN API ROUTES SECTION END

// Protection MiddleWare: Check if user is logged in Middleware
const checkLoggedIn = async (req, res, next) => {
	// console.log('Current User is', req.user)
	// console.log('Current User is', req.body)
	// const isLoggedIn = req.isAuthenticated() && req.user
	// const user = await userModel.find({})

	// if (!isLoggedIn) {
	// 	return res.status(404).send("You're not LoggedIn, Please Login or signUp!")
	// }
	next()
}
// @Desc     The dashboard of the application
// @Method   GET
// @Route    https://localhost:3001/dashboard
app.get('/dashboard', checkLoggedIn, (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// ** ERROR HANDLING API ROUTES SECTION START
// @Desc     React Homepage returned at localhost:3001
// @Method   GET
// @Route    https://localhost:3001/
app.get('/*', (req, res) => {
	// res.sendFile(path.join(__dirname, 'public', 'index.html'))
	res.status(404).end()
})

// @Desc     unknown Route Handler
// @Method   GET
// @Route    /something
const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

module.exports = app
