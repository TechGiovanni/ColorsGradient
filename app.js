const express = require('express')
const app = express()
// require('dotenv').config()
const config = require('./utils/config')
const cors = require('cors')
const colors = require('colors')
const path = require('path') // for react the build middleware
const morgan = require('morgan')
const helmet = require('helmet')

// Middleware
app.use(helmet())
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

// Login
app.get('/auth/google', (req, res) => {
	res.send('<p>Registering with google</p>')
}) // login with google
app.get('/auth/google/callback', (req, res) => {}) // login redirect from google
app.get('/auth/logout', (req, res) => {
	res.send('<p>Logging out</p>')
})

// app.get('/dash', (req, res) => {
// 	app.send('<H1>Welcome</H1>')
// })

// Routes
// app.use('/api/notes', notesRouter) example
// app.get('/', (req, res) => {
// 	app.send('<H1>Welcome</H1>')
// })

const checkLoggedInForDashboard = (req, res, next) => {
	const logedIn = true
	if (!logedIn) {
		return res.status(404).send("You're not LoggedIn, Please Login")
	}

	next()
}

app.get('/dashboard', checkLoggedInForDashboard, (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

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
