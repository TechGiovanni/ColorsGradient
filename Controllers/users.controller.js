const UserModel = require('../Models/user.model')
const bcrypt = require('bcryptjs')
const path = require('path')

// @Desc     Display all Users
// @Method   GET
// @Route    /api/v1/users
async function getAllUsers(req, res) {
	res.json(await UserModel.find({}))
}

// @Desc     Display the current User
// @Method   GET
// @Route    /api/v1/users/current
function currentUser(req, res) {
	let Cuser = req.user
	res.status(200).json({ user: Cuser })
}

// TODO Email and Password Login Start

// @Desc    login a user with email and password
// @Method  POST
// @Route   /api/v1/users/login
function loginUser(req, res) {
	// console.log('Request data', req.body)
	res.json({ message: 'hello' })
}

// @Desc    register a user with email and password
// @Method  POST
// @Route   /api/v1/users
async function registerUser(req, res) {
	const { firstName, lastName, email, password, repeatPassword } = req.body
	let errors = []

	// Check required fields
	if (!firstName || !lastName || !email || !password || !repeatPassword) {
		errors.push({ msg: 'Please fill in all fields' })
	}

	// Check that passwords match
	if (password !== repeatPassword) {
		errors.push({ msg: 'Passwords are not the same' })
	}

	// Check that passwords atleast 6 characters
	if (password.length < 6) {
		errors.push({ msg: 'Passwords should be atleast 6 characters' })
	}

	// if errors.length is greater than 0, that means we have an issue
	if (errors.length > 0) {
		// if there is an issue then I want to rerender the registration form
		// then we want to pass the errors in and also the data
		res.json({ msg: errors })
	} else {
		// we want to see if there is a match with the email in the database comparing it to the email that the registered user submitted.
		// [] Check if user already exists in the database
		await UserModel.findOne({ email: email }).then(async (user) => {
			if (user) {
				// User Exists.
				// then we push a new error object with a key 'msg' for message and the actual error as a key in the variable above to be displayed in the frontend
				errors.push({ msg: "I'm sorry this user already exist!" })
				res.json({ msg: errors })
			} else {
				// We will hash the password before saving it to the database
				// [] Encrypt password
				// we need to generate a salt in order to create a hash
				const salt = await bcrypt.genSalt(12)
				const hashedPassword = await bcrypt.hash(password, salt) // returns the encrypted password, of the newUser that just registered.

				// we created a new instance of user, but we haven't saved it yet
				const newUser = new UserModel({
					firstName,
					lastName,
					email,
					password: hashedPassword,
				})

				// set the new user's password to the encrypted password version
				// newUser.password = hashedPassword

				// save the newUser to the database
				newUser
					.save()
					.then((userSaved) => {
						console.log(req.body)
						console.log('user', userSaved)
						// if the user gets saved we want to redirect to the login page
						// res.redirect('/dashboard')
						req.login(newUser, function (err) {
							if (err) {
								return next(err)
							}
							return res.status(301).redirect('/dashboard')
						})
					})
					.catch((err) => {
						console.log('Error Saving newUser:', err)
					})
			}
		})
	}
}
// TODO Email and Password Login End

module.exports = {
	getAllUsers,
	currentUser,
	loginUser,
	registerUser,
}
