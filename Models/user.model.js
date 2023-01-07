const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, 'Please add your first name'],
			trim: true, // trim any white space
		},
		lastName: {
			type: String,
			required: [true, 'Please add your last name'],
			trim: true,
		},
		email: {
			type: String,
			required: [true, 'Please add a email'],
			unique: true,
			trim: true,
		},
		password: {
			type: String,
			min: [6, 'Must be at least 6, got {VALUE}'],
			required: false,
			select: false, // whenever we output this user, we don't have to show the password
		},
		googleId: {
			type: String,
			required: false,
		},
		favoriteColor: [String],
	},
	{
		timestamps: true,
	}
)

// missingUsernameError - This means that whenever we use passport-local, we always have to specify a user within our form. When we login, passport will check the username and the password, the username can be the name of the person ot the email, so we need to specify what will be the username. to do that we pass an object specifying what the usernameField in passport would be, which is the email.
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	},
})

module.exports = mongoose.model('User', userSchema)
