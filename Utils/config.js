require('dotenv').config()

const PORT = process.env.PORT || 8000
// const MONGODB_URI = process.env.MONGODB_URI

const MONGODB_URI =
	process.env.NODE_ENV === 'test'
		? process.env.TEST_MONGODB_URI
		: process.env.MONGODB_URI

// Google
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

// Session Keys
const COOKIE_KEY_1 = process.env.COOKIE_KEY_1
const COOKIE_KEY_2 = process.env.COOKIE_KEY_2

module.exports = {
	MONGODB_URI,
	PORT,
	CLIENT_ID,
	CLIENT_SECRET,
	COOKIE_KEY_1,
	COOKIE_KEY_2,
}
