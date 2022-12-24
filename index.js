const http = require('http')
const app = require('./app') //Express application

require('dotenv').config() // the actual Express application
const { PORT } = require('./utils/config')
const colors = require('colors')
const mongoose = require('mongoose')
const config = require('./utils/config')

const server = http.createServer(app)

const environment = process.env.NODE_ENV

// Checking mongoose connection
mongoose.connection.on('open', () => {
	console.log('MongoDB Connection Ready')
})
mongoose.connection.error('error', (err) => {
	console.log(`Error`, err)
})

async function startServer() {
	// connect to the database
	console.log('Connecting to:'.cyan.underline, config.MONGODB_URI)
	await mongoose.set('strictQuery', false)
	await mongoose
		.connect(config.MONGODB_URI)
		.then(() => {
			console.log('Connected to the MongoDB Database'.cyan.underline)
		})
		.catch((error) => {
			console.error('Error connecting to MongoDB:', error.message)
		})

	//
	//
	server.listen(PORT, () => {
		console.log(
			`Server running on port ${PORT} in ${environment} mode`.cyan.underline
		)
	})
}

startServer()
