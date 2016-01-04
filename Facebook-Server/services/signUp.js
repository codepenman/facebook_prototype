 /**
 * New node file
 */

var ObjectId = require('mongodb').ObjectID;

var bcrypt = require('bcrypt');

exports.signUp = function(message, callback)	{

	// These two variables come from the form on
	// the views/login.hbs page
	var res = {};	
	//console.log("In Sign Up request:" + message.username);
	
	var date = new Date();
	var timeStamp = date.getTime();
	//console.log("timestamp: "+timeStamp);

	var pk = ObjectId.createPk(timeStamp).toString();	
	//console.log("Primary Key : " + pk);
	
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(message.password, salt, function(err, hash) {
	    	//console.log("password" + hash);
	    	
	    	var userData = {
	    			_id:pk,
	    			username: message.username, 
	    			password:hash, 
	    			firstname:message.firstname, 
	    			lastname:message.lastname,
	    			dob:message.dob,
	    			gender:message.gender,
	    			friends:message.friends,
	    			friendReqsReceived:message.friendReqsReceived,
	    			friendReqsSent:message.friendReqsSent,
	    			joinedGroups:message.joinedGroups,
	    			profile:message.profile
	    	};

	    	var collection = db.collection("users");
	    	collection.findOne({username:message.username}, function(err, user)	{
	    		//console.log(user);
	    		if(user)	{
	    			//console.log("User Data found");
	    			res.exists = true;
	    			callback(res);			
	    		}else	{
	    			collection.insert(userData, function(err, user){
	    				if (user) {
	    					/*console.log(user._id);
	    					console.log(user);
	    					console.log(userData._id);*/
	    					res.exists = false;
	    				}
	    				//console.log("User Data Inserted");
	    				callback(res);
	    			});					
	    		}
	    	});
	    });
	});
};		
