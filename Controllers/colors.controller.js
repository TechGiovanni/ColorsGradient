const ColorModel = require('../Models/color.model')

// @Desc     Display all Colors
// @Method   GET
// @Route    /api/v1/colors
const getAllColors = async (req, res) => {
	res.json(await ColorModel.find({}))
}

// @Desc     Post Colors
// @Method   GET
// @Route    /api/v1/colors
const postColor = async (req, res) => {
	// console.log('request Body', req.body.colorCodes)
	const newColor = {
		colorCodes: req.body.colorCodes,
	}
	color = await ColorModel.create(newColor)
	return res.json(color)
}

// @Desc     Post Colors
// @Method   GET
// @Route    /api/v1/colors/:id
const updateColors = () => {}

module.exports = {
	getAllColors,
	postColor,
	updateColors,
}
