
exports.signOut = function(req, res)	{
	req.session.destroy(function(err)	{
		console.log("Current Session is destroyed");
		console.log(err);
	});
	console.log("Redirecting to Login Page");
	res.redirect("/");
};