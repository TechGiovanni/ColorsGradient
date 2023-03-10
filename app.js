const express = require('express')
const app = express()
const fs = require('fs')
// require('colors')
const cors = require('cors')
const path = require('path') // for react the build middleware
const morgan = require('morgan')
const helmet = require('helmet')
const passport = require('passport')
const cookieSession = require('cookie-session')
const { Strategy } = require('passport-google-oauth20')
const LocalStrategy = require('passport-local').Strategy
const {
	CLIENT_ID,
	CLIENT_SECRET,
	COOKIE_KEY_1,
	COOKIE_KEY_2,
} = require('./Utils/config')

const UserModel = require('./Models/user.model')

const usersRouter = require('./Routes/usersRouter')
const colorsRouter = require('./Routes/colorsRouter')
const authRouter = require('./Routes/authRouter')

async function verifyCallback(accessToken, refreshToken, profile, done) {
	console.log('Google Profile', profile.emails[0].value)
	// console.log('Google Profile', profile)
	// console.log('accessToken', accessToken)
	// This is where we could also save the user profile to the database
	// User.findOrCreate({ googleId: profile.id }, function (err, user) {
	// return cb(err, user);
	// });
	// done(null, profile)
	// Adding the user to the Mongo database
	const newUser = {
		// name: profile.displayName,
		email: profile.emails[0].value,
		googleId: profile.id,
		firstName: profile.name.givenName,
		lastName: profile.name.familyName,
		// image: profile.photos[0].value,
	} // this will give us the new user

	try {
		// we want to try to store the user.
		let user = await UserModel.findOne({ googleId: profile.id }) // to see if that user exists already

		let userEmail = await UserModel.findOne({ email: profile.emails[0].value })

		if (user || userEmail) {
			// console.log('user already signed up!!!', 'User', user)
			// console.log('user already signed up!!!', 'Email', userEmail)
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
			callbackURL: '/auth/google/callback',
		},
		verifyCallback
	)
)

// Saving the session to the cookie
passport.serializeUser((user, done) => {
	// A login session is established upon a user successfully authenticating
	// If successfully verified, Passport will call the serializeUser function, which in the above example is storing the user's ID, username, and picture to the cookie.
	// console.log('serializer', user)
	// console.log('serializer id', user._id)
	// console.log('serializer googleid', user.googleId)
	done(null, user.id)
})

// Reading the session from the cookie
passport.deserializeUser(async (id, done) => {
	// When the session is authenticated, Passport will call the deserializeUser function, which in the above example is yielding the previously stored user ID, username, and picture. The req.user property is then set to the yielded information.
	// // console.log('Deserlization', id)
	// console.log('User', id)

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
		maxAge: 2 * 24 * 60 * 60 * 1000,
		keys: [COOKIE_KEY_1, COOKIE_KEY_2],
	})
)

app.use(passport.initialize())
app.use(passport.session())
// we also need to specify here, that the user field will be populated by the newUsers email.
passport.use(
	new LocalStrategy({ usernameField: 'email' }, UserModel.authenticate())
)
passport.serializeUser(UserModel.serializeUser())
passport.deserializeUser(UserModel.deserializeUser())

app.use(cors())

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

app.get(
	'/auth/google/callback',
	(req, res, next) => {
		// console.log('Callback Middleware', req)
		next()
	},
	passport.authenticate('google', {
		failureRedirect: '/auth',
		successRedirect: '/dashboard',
		session: true,
		failWithError: true,
	}),
	(req, res) => {
		// Successful authentication, redirect to secret page.
		//redirect back to the frontend secret page
		// res.redirect('/dashboard')
		console.log('Google called us back')
		// res.send()
	}
)
app.get('/failure', (req, res) => {
	return res.send('Failed to log in.')
})

//
// ** MAIN API ROUTES SECTION END

// Protection MiddleWare: Check if user is logged in Middleware
const checkLoggedIn = async (req, res, next) => {
	// console.log('Current User is', req.user)
	// console.log('Current User is', req.body)
	const isLoggedIn = req.isAuthenticated() && req.user
	// const user = await UserModel.find({})

	if (!isLoggedIn) {
		return res.status(404).send("You're not LoggedIn, Please Login or signUp!")
	}
	next()
}
// @Desc     The dashboard of the application
// @Method   GET
// @Route    https://localhost:3001/dashboard
app.get('/dashboard', checkLoggedIn, (req, res) => {
	return res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// const file = fs.readFileSync(
// 	path.join(__dirname, '6A8E190099A04DFC7373B5062DE0AC12.txt')
// )
// app.get(
// 	'/.well-known/pki-validation/B3E5966BB3FD177E8013C2D949AFC3CB.txt',
// 	(req, res) => {
// 		res.sendFile(path.join(__dirname, '6A8E190099A04DFC7373B5062DE0AC12.txt'))
// 	}
// )

// ** ERROR HANDLING API ROUTES SECTION START
// @Desc     React Homepage returned at localhost:3001
// @Method   GET
// @Route    https://localhost:3001/
app.get('/*', (req, res) => {
	return res.sendFile(path.join(__dirname, 'public', 'index.html'))
	// res.status(404).end()
})

// @Desc     unknown Route Handler
// @Method   GET
// @Route    /something
const unknownEndpoint = (request, response) => {
	return response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

module.exports = app
