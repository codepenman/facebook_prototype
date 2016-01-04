/**
 * New node file
 */
var ObjectId = require('mongodb').ObjectID;

exports.handle_request = function(message, callback)	{
	if(message.reqType == "createGroup")		{
		createGroup(message, callback);
	}
	if(message.reqType == "deleteGroup")		{
		deleteGroup(message, callback);
	}
	if(message.reqType == "getGroupMembers")		{
		getGroupMembers(message, callback);
	}
	if(message.reqType == "removeMembers")		{
		removeMembers(message, callback);
	}	
};

function createGroup(message, callback)	{
	console.log("Inside create group");
	var gcollection = db.collection("groups");
	var ucollection = db.collection("users");
	
	var date = new Date();
	var timeStamp = date.getTime();
	console.log("timestamp: "+timeStamp);

	var groupID = ObjectId.createPk(timeStamp).toString();

	console.log("groupID : " + groupID);
	
	console.log("creating groupdata....");
	
	var groupData = {
			_id:groupID,
			groupName:message.groupName,
			groupMembers:message.memberIds
	};
	
	var response = {};
	
	console.log("member ids : " + message.memberIds);
	
	gcollection.insert(groupData, function(err, group){
		response.groupID = groupData._id; 
		console.log("Group Created With ID: " + response.groupID);
		ucollection.update({_id : { $in : message.memberIds}}, {$push : {joinedGroups : groupData._id}}, { multi: true }, function(err, results)	{
			callback(response);			
		});
	});	
}

function deleteGroup(message, callback)	{
	console.log("Inside deleteGroup");
	var gcollection = db.collection("groups");
	var ucollection = db.collection("users");	
	
	var groups = message.groups;
	
	console.log("groups : " + groups);
	
	var response = {};

	var cursor = gcollection.find({_id : {$in : message.groups}});
	var groupMembers = [];
	var numberOfMembers = 0;
	cursor.toArray(function(err, groups)	{
		console.log("Inside array");
		
		for(var i = 0; i < groups.length; i++)	{
			console.log("Inside for loop");
			
			var curGroupMembers = groups[i].groupMembers;
			console.log("curGroupMembers " + curGroupMembers);
			for(var j = 0; j < curGroupMembers.length ; j++)	{
				if(!(curGroupMembers[i] in groupMembers))	{
					groupMembers[numberOfMembers++] = curGroupMembers[j]; 
				}
			}
		}
		
		console.log("Group Members : " + groupMembers);
		
		ucollection.update({_id : { $in : groupMembers}}, {$pull : { joinedGroups : { $in : message.groups}}}, { multi : true }, function(err, result)	{
			console.log("Inside update");
			gcollection.remove({_id : { $in : message.groups}}, function(err, results)	{
				console.log("Inside remove");
				var _cursor = gcollection.find();
				_cursor.toArray(function(err, results)	{
					console.log("Inside inner toArray");
					response.remainingGroups = results;
					callback(response);							
				});
			});
		});
	});
};

function getGroupMembers(message, callback)	{
	console.log("Inside getGroupMembers");	
	var gcollection = db.collection("groups");
	var ucollection = db.collection("users");	
		
	var response = {};
	
	console.log("GroupID : " + message.groupID);
	
	gcollection.findOne({_id : message.groupID}, function(err, group)	{
		if(group == null)	{
			response.groupMembers = [];
			callback(response);
			return;
		}
		console.log("inside findOne..." + group.groupMembers);		
			var _cursor = ucollection.find({_id : { $in : group.groupMembers}});
			_cursor.toArray(function(err, results)	{
				console.log(results);
				response.groupMembers = results;
				callback(response);
			});
	});	
}

function removeMembers(message, callback)	{
	console.log("Inside removeMembers");	
	var gcollection = db.collection("groups");
	var ucollection = db.collection("users");	
		
	var response = {};
	
	console.log("GroupID : " + message.groupID);
	console.log("Members : " + message.members);
		
	gcollection.update({_id : message.groupID}, { $pull : { groupMembers : { $in : message.members}}}, function(err, results)	{
		gcollection.findOne({_id : message.groupID}, function(err, group)	{
			if(group.groupMembers.length == 0)	{
				gcollection.remove({_id : message.groupID}, function(err, results){});
			}
		});
	console.log("Inside groups update....");
		var groupID = [];
		groupID.push(message.groupID);
		ucollection.update({_id : {$in : message.members}}, {$pull : {joinedGroups : {$in : groupID}}}, { multi : true }, function(err, results)	{
			console.log("Inside users update....");
			callback(response);
		});
	});
}