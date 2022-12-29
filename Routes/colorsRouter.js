const colorsRouter = require('express').Router()

const { getAllColors, postColor } = require('../Controllers/colors.controller')

colorsRouter.get('/', getAllColors)
colorsRouter.post('/', postColor)

// !! Create a post end point to update the likes of individual colors
// colorsRouter.put('/:id', async () => {})

module.exports = colorsRouter
