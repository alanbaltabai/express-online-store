function checkAuthenticated(request, response, next) {
	if (request.isAuthenticated()) {
		return next();
	} else {
		response.redirect("/");
	}
}

function checkNotAuthenticated(request, response, next) {
	if (request.isAuthenticated()) {
		return response.redirect("/madmin");
	} else {
		next();
	}
}

module.exports = {
	checkAuthenticated,
	checkNotAuthenticated,
};
