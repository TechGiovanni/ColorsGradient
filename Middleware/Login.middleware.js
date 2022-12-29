const checkLoggedIn = (req, res, next) => {
	console.log('Current User is', req.user)
	const isLoggedIn = req.isAuthenticated() && req.user

	if (!isLoggedIn) {
		return res.status(404).send("You're not LoggedIn, Please Login or signUp!")
	}
	next()
}

module.exports = {
	checkLoggedIn,
}
