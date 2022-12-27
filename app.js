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
const ColorModel = require('./Models/color.model')

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

	//
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
	done(null, user.id)
})

// Reading the session from the cookie
passport.deserializeUser((id, done) => {
	UserModel.findById(id).then((user) => {
		done(null, user)
	})
	// done(null, id)
})

// Middleware
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

// app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))

// TODO LOGIN USER SECTION START
// Starting the google Flow
app.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: ['email', 'profile'],
	})
) // login with google

// Google callback
app.get(
	'/auth/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/failure',
		successRedirect: '/dashboard',
		session: true,
	}),
	(req, res) => {
		console.log('Google called us back')
		// res.redirect('/dashboard')
	}
) // login redirect from google

// Logging Out a User
app.get('/auth/logout', (req, res) => {
	req.logout() // removes req.user and clears any logged in session
	return res.redirect('/')
})

// View If authentication with google fails
app.get('/failure', (req, res) => {
	res.send('Failed to log in.')
	// res.send("<button><a href='/auth/logout'>logout</a></button>")
})
// TODO LOGIN SECTION END

// TODO COLOR SECTION START
// get all colors from the database
// create colors in the database

app.get('/api/v1/colors', async (req, res) => {
	res.json(await ColorModel.find({}))
})
// Post request to create colors to be displayed
app.post('/api/v1/colors', async (req, res) => {
	console.log('request Body', req.body.colorCodes)
	const newColor = {
		colorCodes: req.body.colorCodes,
	}
	color = await ColorModel.create(newColor)
	return res.json(color)
})

// TODO  COLOR SECTION END

// ROUTES
// app.use('/api/notes', notesRouter) example
// app.get('/', (req, res) => {
// 	app.send('<H1>Welcome</H1>')
// })
//
// Protection MiddleWares
// Check if user is logged in Middleware
const checkLoggedIn = (req, res, next) => {
	console.log('Current User is', req.user)
	const isLoggedIn = req.isAuthenticated() && req.user
	if (!isLoggedIn) {
		return res.status(404).send("You're not LoggedIn, Please Login or signUp!")
	}

	next()
}
app.get('/api/v1/users', async (req, res) => {
	res.json(await UserModel.find({}))
})
// The dashboard of the application
// GET localhost:3001/dashboard
// app.get('/dashboard', checkLoggedIn, (req, res) => {
// 	res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })

// React view returned att localhost:3001
// GET homepage
app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// unknown Route Handler
const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

module.exports = app
