const colorsRouter = require('express').Router()

const {
	getAllColors,
	postColor,
	updateColors,
} = require('../Controllers/colors.controller')

colorsRouter.get('/', getAllColors)
colorsRouter.post('/', postColor)
colorsRouter.put('/:id', updateColors)

module.exports = colorsRouter
