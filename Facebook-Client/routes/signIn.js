
module.exports = function (app)	{
	app.post('/signIn', signIn);
};

function signIn(req, res)	{
	var username = req.param("username");
	var password = req.param("password");
	
	var msg_payload = {username:username, password:password};
	console.log("Message paylod" + msg_payload);
	
	mq_client.make_request("signin_req_queue", msg_payload, function(response) {
		console.log("Sign In Response=" + response);

		if(response.error)	{
			res.send({invalidUser:true, invalidLogInMsg:response.message});		
		}else	{
			req.session.UserID = response.UserID;
			console.log("Session is been set" + req.session.UserID);		
			res.send({invalidUser:false});		
		}
	});
};
