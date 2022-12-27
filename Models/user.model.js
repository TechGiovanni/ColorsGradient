const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, 'Please add your first name'],
		},
		lastName: {
			type: String,
			required: [true, 'Please add your last name'],
		},
		email: {
			type: String,
			required: [true, 'Please add a email'],
			unique: true,
		},
		password: {
			type: String,
			min: [6, 'Must be at least 6, got {VALUE}'],
			required: false,
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

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.password
	},
})

module.exports = mongoose.model('User', userSchema)
