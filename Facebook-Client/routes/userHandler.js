/**
 * New node file
 */
var userModule = require('./user');

//This method will be invoked while loading Home Page, so we should be having session created by this time and session should be having Current UserID..
exports.getUserDetails = function(req, res)	{
	console.log("Inside getUserDetails");
	console.log("UserID : " + req.session.UserID);
		
	var msg_payload = {userid:req.session.UserID, reqType:"getUserDetails"};
	console.log("Message payload" + msg_payload);
	
	mq_client.make_request("user_req_queue", msg_payload, function(response) {
		console.log("getUserDetails Response=" + response);
		
		var user = response.user;
		var profile = response.user.profile;
		var suggestedFriends = [];
		
		var rSuggestedFriends = response.suggestedFriends;
		
		for( var i =0;i<rSuggestedFriends.length;i++)	{
			suggestedFriends.push(new userModule.Friend(rSuggestedFriends[i]._id, rSuggestedFriends[i].firstname));
		}
		
		var joinedGroups = [];
		for( var i =0;i<response.joinedGroups.length;i++)	{
			joinedGroups.push(new userModule.Group(response.joinedGroups[i]._id, response.joinedGroups[i].groupName));
		}
		
		
		var userData = new userModule.User(user._id, user.firstname, user.lastname, user.friends,
				user.friendReqsSent, user.friendReqsReceived, suggestedFriends, joinedGroups);
		
		var profileData = new userModule.Profile(profile.aboutUser,
				profile.employerName,
				profile.collegeName,
				profile.mobileNumber,
				profile.lifeEvent,
				profile.musicName,
				profile.sportName,
				profile.showName);

		console.log("About User: " + profileData.aboutUser);
		console.log("About User: " + profile.aboutUser);
		
		console.log("Sending the response to html client");		
		
		res.send({
			userData: JSON.stringify(userData),
			profileData: JSON.stringify(profileData)
		});	
		console.log("Response Sent" + JSON.stringify(res));
	});
};

exports.updateProfile = function(req, res)	{
	console.log("Inside updateProfile");
	console.log("UserID : " + req.session.UserID);
	console.log("about user " + req.param("aboutUser"));
	
	var msg_payload = {userid:req.session.UserID, 
			reqType:"updateProfile",
    		aboutUser:req.param("aboutUser"),
    		employerName:req.param("employerName"),
    		collegeName:req.param("collegeName"),
    		mobileNumber:req.param("mobileNumber"),
    		lifeEvent:req.param("lifeEvent"),
    		musicName:req.param("musicName"),
    		sportName:req.param("sportName"),
    		showName:req.param("showName")};

	console.log("Message payload" + JSON.stringify(msg_payload));
	
	mq_client.make_request("user_req_queue", msg_payload, function(response) {
		console.log("updateProfile Response");
		
		if(response.error)	{
			res.send({isUpdateSuccessfull:false});		
		}else	{
			res.send({isUpdateSuccessfull:true});
		}
		
		console.log("Profile updated response sent");
	});
};

exports.sendFriendRequest = function(req, res)	{
	console.log("Inside sendFriendRequest");
	console.log("UserID : " + req.session.UserID);

	console.log(JSON.parse(req.param("totalSentFriendReq")));
	var currReqSent = [];
	
/*	var existingRequests = JSON.parse(req.param("totalSentFriendReq"));
	
	for(var i = 0; i < existingRequests.length; i++)	{
		currReqSent[i] = existingRequests[i];
	}
	
	currReqSent.push(req.param('newFriendID'));
*/	
	var msg_payload = {userid:req.session.UserID, 
			reqType:"newFriendRequest",
			newFriendID : req.param("newFriendID"),
			updatedRequests:currReqSent};

	console.log("Message payload" + JSON.stringify(msg_payload));
	
	mq_client.make_request("user_req_queue", msg_payload, function(response) {
		console.log("sendFriendRequest Response");
		res.send({error:response.error});
	});	
};

exports.getFriendDetails = function(req, res)	{
	console.log("Inside getUserDetails");
	console.log("UserID : " + req.session.UserID);
	
	var req_friendIDs = JSON.parse(req.param("friendID"));
	var _friendIDs = [];
	
	for(var i = 0; i < req_friendIDs.length; i++)	{
		_friendIDs.push(req_friendIDs[i]);
	}
	_friendIDs.push("12873612738");
	
	var msg_payload = {userid:req.session.UserID, reqType:"getFriendDetails", 
			friendIDs:_friendIDs};
	
	console.log("Message payload" + msg_payload);
	
	mq_client.make_request("user_req_queue", msg_payload, function(response) {
		console.log("getUserDetails Response=" + response);
		
		var friendsDetails = response.friendsDetails;
		var _friendsDetails = [];
		
		for( var i =0;i<friendsDetails.length;i++)	{
			_friendsDetails.push(new userModule.Friend(friendsDetails[i]._id, friendsDetails[i].firstname));
		}

		res.send({friends: JSON.stringify(_friendsDetails)});
	});	
};

exports.acceptFriendRequest = function(req, res)	{
	console.log("Inside acceptFriendRequest");
	console.log("UserID : " + req.session.UserID);

	console.log(JSON.parse(req.param("currFriendsList")));
	
	var msg_payload = {userid:req.session.UserID, 
			reqType:"acceptFriendRequest",
			newFriendID : req.param("newFriendID")};

	console.log("Message payload" + JSON.stringify(msg_payload));
	
	mq_client.make_request("user_req_queue", msg_payload, function(response) {
		console.log("acceptFriendRequest Response");
		res.send({error:response.error});
	});		
};

exports.getUpdates = function(req, res)	{	
	console.log("Inside newsFeed");
	
	var msg_payload = {userid:req.session.UserID, 
			reqType:"getUpdates"};

	console.log("Message payload" + JSON.stringify(msg_payload));
	
	mq_client.make_request("user_req_queue", msg_payload, function(response) {
		console.log("getUpdates Response");
		
		var updates = []
		
		for(var i = 0; i<response.updates.length; i++)	{
			updates.push(response.updates[i].update);
		}
		
		res.send({updates:JSON.stringify(updates)});
	});	
};
