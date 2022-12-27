const mongoose = require('mongoose')

const colorSchema = new mongoose.Schema(
	{
		colorCodes: {
			type: [String],
			max: 4,
			required: true,
		},
		likes: {
			type: Number,
			required: false,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
)

colorSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.password
	},
})

module.exports = mongoose.model('Color', colorSchema)
