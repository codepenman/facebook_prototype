/**
 * New node file
 */

exports.handle_request = function(message, callback)	{
	if(message.reqType == "getUserDetails")		{
		getUserDetails(message, callback);
	}
	if(message.reqType == "updateProfile")	{
		updateProfile(message, callback);
	}
	if(message.reqType == 'newFriendRequest')	{
		sendFriendRequest(message, callback);
	}
	if(message.reqType == 'acceptFriendRequest')	{
		acceptFriendRequest(message, callback);
	}
	if(message.reqType == 'getFriendDetails')	{
		getFriendDetails(message, callback);
	}
	if(message.reqType == 'getUpdates')	{
		getUpdates(message, callback);
	}
};

function getUserDetails(message, callback)	{
	console.log("Inside getUserDetails");
		
	var collection = db.collection('users');
	var gcollection = db.collection('groups');
	
	var response = {};
	
	console.log(message.userid);	
	collection.findOne({_id : message.userid}, function(err, user)	{
		console.log(user);
		console.log(user.friends);		
		response.user = user;
		
		var currFriends = [];

		console.log(user.friendReqsSent);		
		console.log(user.friendReqsReceived);

		var reqSentFriend = user.friendReqsSent;
		var reqRecFriend = user.friendReqsReceived;
		var friends = user.friends;

		console.log("friends" + user.friends);
		for(var i = 0;i < friends.length;i++)	{
			console.log("inside reqSent");
			currFriends[i] = friends[i];
		}

		console.log("reqSentFriend" + reqSentFriend);
		for(var i = 0;i < reqSentFriend.length;i++)	{
			console.log("inside reqSent");
			currFriends[i] = reqSentFriend[i];
		}
		
		console.log("reqRecFriend" + reqRecFriend);
		for(var i = 0;i < reqRecFriend.length;i++)	{
			console.log("inside reqRec");
			currFriends[i] = reqRecFriend[i];
		}					
		
		currFriends.push(message.userid); // I add myself as a friend
		console.log(currFriends);
		
		var cursor = collection.find({_id : {$nin : currFriends}});
		
		cursor.toArray(function(err, results)	{
			console.log("Inside toArray");
			console.log(results);
			response.suggestedFriends = results;
			var groupCur = gcollection.find({_id : { $in : user.joinedGroups}});
			groupCur.toArray(function(err, results)	{
				response.joinedGroups = results;
				callback(response);				
			});			
		});					
	});
}

function updateProfile(message, callback)	{
	console.log("Inside updateProfile");
	
	var collection = db.collection('users');
	var response = {};
		
	collection.update({_id : message.userid}, {$set:{profile:{aboutUser:message.aboutUser, 
																	employerName:message.employerName,
																	collegeName:message.collegeName,
																	mobileNumber:message.mobileNumber,
																	lifeEvent:message.lifeEvent,
																	musicName:message.musicName,
																	sportName:message.sportName,
																	showName:message.showName} }}, 
																	function(err, results) {
																		
																		console.log("got response from update");
																		if(err)	{
																			response.error = true;
																		}else	{
																			response.erro = false;
																		}		
																
																		callback(response);		
	});
	
	var updatesCollection = db.collection('updates');
	collection.findOne({_id : message.userid}, function(err, user)	{
		var msg = user.firstname + " updated profile";
		var msg_payload = {update:msg};
		updatesCollection.insert(msg_payload, function(err, result){});
	});
}

function sendFriendRequest(message, callback)	{
	console.log("Inside sendFriendRequest");	

	console.log("All sent requests " + message.updatedRequests);

	var collection = db.collection('users');
	var response = {};
		
	collection.update({_id : message.userid}, {$push: { friendReqsSent: message.newFriendID}}, function(err, results) {
		if(err)	{
			response.error = true;
			callback(response);
		}else	{
			collection.update({_id : message.newFriendID}, {$push : {friendReqsReceived : message.userid}}, function(err, results)	{
				console.log("Friend Request Sent");
				if(err)	{
					response.error = true;
				}else	{
					response.error = false;
				}
				callback(response);
			});			
		}
	});
	
	var updatesCollection = db.collection('updates');
	collection.findOne({_id : message.userid}, function(err, user)	{
		collection.findOne({_id : message.newFriendID}, function(err, friend)	{
			var msg = user.firstname + " sent friend request to " + friend.firstname;
			var msg_payload = {update:msg};
			updatesCollection.insert(msg_payload, function(err, result){});			
		})
	});	
}

function acceptFriendRequest(message, callback)	{
	console.log("Inside acceptFriendRequest");	

	var collection = db.collection('users');
	var response = {};
	var reqsToRemove = [];
	reqsToRemove.push(message.newFriendID);
	collection.update({_id : message.userid}, {$push: { friends: message.newFriendID}, $pull: { friendReqsReceived: {$in : reqsToRemove}}}, function(err, results) {
		if(err)	{
			response.error = true;
			callback(response);
		}else	{
			var reqsToRemove = [];
			reqsToRemove.push(message.userid);
			collection.update({_id : message.newFriendID}, {$push : {friends : message.userid}, $pull : {friendReqsSent: {$in : reqsToRemove}}}, function(err, results)	{
				console.log("Friend Request accepted");
				if(err)	{
					response.error = true;
				}else	{
					response.error = false;
				}
				callback(response);
			});			
		}
	});
	
	var updatesCollection = db.collection('updates');
	collection.findOne({_id : message.userid}, function(err, user)	{
		collection.findOne({_id : message.newFriendID}, function(err, friend)	{
			var msg = user.firstname + " accepted friend request sent from " + friend.firstname;
			var msg_payload = {update:msg};
			updatesCollection.insert(msg_payload, function(err, result){});			
		})
	});	
}

function getFriendDetails(message, callback)	{
	console.log("Inside getFriendDetails");

	var response = {};
	console.log("Friend IDs : " + message.friendIDs);

	var collection = db.collection('users');

	var cursor = collection.find({_id : {$in : message.friendIDs}});

	cursor.toArray(function(err, results)	{
		console.log("Inside toArray in getFriendDetails");
		console.log(results);
		response.friendsDetails = results;
		callback(response);			
	});	
}

function getUpdates(message, callback)	{	
	console.log("Inside newsFeed");
	var collection = db.collection("updates");
	var response = {};
	
	var cursor = collection.find();
	
	cursor.toArray(function(err, updates)	{
		response.updates = updates;
		callback(response);
	});
};
