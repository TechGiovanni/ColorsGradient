const express = require('express')
const app = express()
// require('colors')
const cors = require('cors')
const path = require('path') // for react the build middleware
const morgan = require('morgan')
const helmet = require('helmet')
const passport = require('passport')
const { Strategy } = require('passport-google-oauth20')
const { CLIENT_ID, CLIENT_SECRET } = require('./Utils/config')

function verifyCallback(accessToken, refreshToken, profile, done) {
	console.log('google profile', profile)
	// This is where we could also save the user profile to the database
	// User.findOrCreate({ googleId: profile.id }, function (err, user) {
	// return cb(err, user);
	// });
	done(null, profile)
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

// Middleware
app.use(helmet())
app.use(passport.initialize())

app.use(cors({ origin: 'http://localhost:3000' }))

app.use(morgan('combined'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))

// Protection MiddleWares
// function isLoggedIn() {}
// app.use((req, res, next) => {
// 	if (!isLoggedIn) {
// 	}
// })

// LOGIN USER SECTION START
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
		session: false,
	}),
	(req, res) => {
		console.log('Google called us back')
		// res.redirect('/dashboard')
	}
) // login redirect from google

// Logging Out a User
app.get('/auth/logout', (req, res) => {
	res.send('<p>Logging out</p>')
})

// View If authentication with google fails
app.get('/failure', (req, res) => {
	return res.send('Failed to log in')
})
// LOGIN SECTION END

// COLOR SECTION START
// get all colors from the database
// create colors in the database

// COLOR SECTION END

// ROUTES
// app.use('/api/notes', notesRouter) example
// app.get('/', (req, res) => {
// 	app.send('<H1>Welcome</H1>')
// })

// Check if user is logged in Middleware
const checkLoggedInForDashboard = (req, res, next) => {
	const loggedIn = true
	if (!loggedIn) {
		return res.status(404).send("You're not LoggedIn, Please Login")
	}

	next()
}

// The dashboard of the application
// GET localhost:3001/dashboard
app.get('/dashboard', checkLoggedInForDashboard, (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

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
