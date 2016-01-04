
/*
 * GET home page.
 */

exports.login = function(req, res){
	if(req.session.UserID)	{
		res.render('homePage');
	}else	{
		res.render('login');		
	}
};

exports.partials = function(req, res)	{
	var name = req.params.name;
	console.log(name);
	res.render('partials/' + name);
};

exports.homePage = function(req, res)	{
	if(req.session.UserID)	{
		res.render('homePage');
	}else	{
		res.redirect('/');		
	}
};
