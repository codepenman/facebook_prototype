
var user = require('./user');
var newModule = require('./signUp_new');

function userExists(req, res)	{
	//console.log("Inside user Exists");
	res.send({userExists:true, existingUser:'Username is already in use'});
}

function userCreated(req, res)	{
	//console.log("Inside new user");
	res.send({userExists:false, sucessfullSignUpMsg:'Registration Sucessful, Continue with Log In'});
}

exports.signUp = function(req, res)	{
	
	var friends = [];
	var friendReqsReceived = [];
	var friendReqsSent = [];
	var joinedGroups = [];
	
	var year = req.param("year");
	var day = req.param("day");
	var month = req.param("month");	
	
	var dob = year + '-' + month + '-' + day;

	var profile = user.getDefaultProfile();
	
	//Validation of username
	var msg_payload = {
		username:req.param("username"),
		password:req.param("password"),
		firstname:req.param("firstname"),
		lastname:req.param("lastname"),
		dob:dob,
		gender:req.param("gender"),
		friends:friends,
		friendReqsReceived:friendReqsReceived,
		friendReqsSent:friendReqsSent,
		joinedGroups:joinedGroups,
		profile:JSON.stringify(profile)
	};
	
/*	newModule.signUp(msg_payload, function(response) {
		//console.log("Final Callback");
		if(response.exists)	{
			userExists(req, res);
		}else	{
			userCreated(req, res);
		}
	});*/
	
	mq_client.make_request("signup_req_queue", msg_payload, function(response) {
		//console.log("Final Callback");
		if(response.exists)	{
			userExists(req, res);
		}else	{
			userCreated(req, res);
		}
	});
};
