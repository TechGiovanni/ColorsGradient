const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add a name'],
		},
		email: {
			type: String,
			required: [true, 'Please add a email'],
			unique: true,
		},
		password: {
			type: String,
			minLength: [6, 'Must be at least 6, got {VALUE}'],
			required: [true, 'Please add a password'],
		},
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
