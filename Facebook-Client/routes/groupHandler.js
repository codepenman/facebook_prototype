/**
 * New node file
 */

var userModule = require('./user');

exports.createGroup = function(req, res)	{
	console.log("Inside createGroup");
	console.log("UserID : " + req.session.UserID);
	
	var _groupMembers = JSON.parse(req.param('groupMembers'));
	var memberIds = [];
	
	console.log("groupMembers: " + _groupMembers[0].id);
	
	for(var i = 0;i<_groupMembers.length;i++)	{
		console.log("Inside groupMembers Loop");
		memberIds.push(_groupMembers[i].id);
	}
	memberIds.push(req.session.UserID);
	
	var msg_payload = {userid:req.session.UserID, 
			reqType:"createGroup",
			groupName:req.param("groupName"),
			memberIds:memberIds};
	
	console.log("Message payload" + msg_payload);
	
	mq_client.make_request("group_req_queue", msg_payload, function(response) {
		console.log("createGroup Response");
		
		res.send({groupID:response.groupID});
	});	
};

exports.deleteGroup = function(req, res)	{
	console.log("Inside deleteGroup");
	console.log("UserID : " + req.session.UserID);
	
	var _groups = JSON.parse(req.param('groups'));
	var memberIds = [];
	
	console.log("_groups: " + _groups[0].id);
	
	
	var msg_payload = {userid:req.session.UserID, 
			reqType:"deleteGroup",
			groups:_groups};
	
	console.log("Message payload" + msg_payload);
	
	mq_client.make_request("group_req_queue", msg_payload, function(response) {
		console.log("deleteGroup Response");
		
		var remaining = response.remainingGroups;
		var _remaining = [];
		
		for(var i = 0; i < remaining.length; i++)	{
			_remaining[i] = new userModule.Group(remaining[i]._id, remaining[i].groupName);
		}
		
		res.send({remainingGroups:JSON.stringify(_remaining)});
	});		
};

exports.getGroupMembers = function(req, res)	{
	console.log("Inside getGroupMembers");	
	
	var msg_payload = {userid:req.session.UserID, 
			reqType : "getGroupMembers",
			groupID : req.param("groupID")};
	
	console.log("Message payload" + msg_payload);
	
	mq_client.make_request("group_req_queue", msg_payload, function(response) {
		console.log("getGroupMembers Response");
		
		var groupMembers = response.groupMembers;
		var memberNames = [];
		
		for(var i = 0; i < groupMembers.length; i++)	{
			memberNames.push({id : groupMembers[i]._id, name : groupMembers[i].firstname});
		}
		res.send({groupMembers: JSON.stringify(memberNames)});
	});			
};

exports.removeMembers = function(req, res)	{
	console.log("Inside removeMembers");	
	
	var msg_payload = {userid:req.session.UserID, 
			reqType : "removeMembers",
			groupID : req.param("groupID"),
			members : JSON.parse(req.param("members"))};
	
	console.log("Message payload" + msg_payload);
	
	mq_client.make_request("group_req_queue", msg_payload, function(response) {
		console.log("removeMembers Response");

		res.send({});
	});
};
