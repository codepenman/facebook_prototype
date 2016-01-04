/**
 * New node file
 */
var bcrypt = require('bcrypt');

exports.signIn = function(message, callback){
	// These two variables come from the form on
	// the views/login.hbs page
	var res = {};
	console.log("In Sign In request:"+ message.username);
	var username = message.username;
	var password = message.password;

	var collection = db.collection('users');
	
	collection.findOne({username: username}, function(err, user){
		console.log("User: " + JSON.stringify(user));
		if (user) {
			var valid = bcrypt.compareSync(password, user.password); //(password, hash)
			if(valid == true)	{
				res.error = false;		
				res.UserID = user._id;				
			}else	{
				res.error = true;
				res.message = "Invalid Password";
			}
		}else	{
			res.error = true;
			res.message = "Invalid User Name";
		}		
		callback(res);
	});
};
