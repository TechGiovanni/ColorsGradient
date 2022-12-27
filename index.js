const fs = require('fs')
const https = require('https')
const app = require('./app') //Express application

require('dotenv').config()

const { PORT, MONGODB_URI } = require('./Utils/config')
// require('colors')
const mongoose = require('mongoose')

const environment = process.env.NODE_ENV

const server = https.createServer(
	{
		key: fs.readFileSync('key.pem'),
		cert: fs.readFileSync('cert.pem'),
	},
	app
)

// Checking mongoose connection
mongoose.connection.once('open', () => {
	console.log('MongoDB Connection is Ready!')
})
mongoose.connection.on('error', (err) => {
	console.log(`Error Connecting to MongoDB`, err, err.message)
})

// Starting server ~ Connect to mongo then start server
async function startServer() {
	console.log('Connecting to:', MONGODB_URI)
	await mongoose.set('strictQuery', false)
	await mongoose
		.connect(MONGODB_URI)
		.then(() => {
			console.log('Connected to the MongoDB Database')
		})
		.catch((error) => {
			console.error('Error connecting to MongoDB:', error.message)
		})

	//
	//

	server.listen(PORT, () => {
		console.log(`Server running on port ${PORT} in '${environment}' mode`)
	})
}

startServer()
