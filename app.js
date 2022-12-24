const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const colors = require('colors')
// const config = require('./utils/config')
// const mongoose = require('mongoose')
const path = require('path') // for react the build middleware
const morgan = require('morgan')

// // connect to the database
// console.log('connecting to', config.MONGODB_URI)
// mongoose.set('strictQuery', false)
// mongoose
// 	.connect(config.MONGODB_URI)
// 	.then(() => {
// 		console.log('connected to MongoDB')
// 	})
// 	.catch((error) => {
// 		console.error('Error connecting to MongoDB:', error.message)
// 	})

//
//

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }))

app.use(morgan('combined'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))

// Routes
// app.use('/api/notes', notesRouter) example

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

//
//
// unknown Route Handler
const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

module.exports = app
