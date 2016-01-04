
var UNDEFINED = "";

function User(userID, firstName, lastName, friends, friendRequestsSent, friendRequestsRecieved, suggestedFriends, joinedGroups)	{
	this.userID = userID;
	this.firstName = firstName;
	this.lastName = lastName;
	this.friends = friends;
	this.friendRequestsSent = friendRequestsSent;
	this.friendRequestsRecieved = friendRequestsRecieved;
	this.suggestedFriends = suggestedFriends;
	this.joinedGroups = joinedGroups;
}

function Profile(aboutUser, employerName, collegeName, mobileNumber, lifeEvent, musicName, sportName, showName)	{
	this.aboutUser = aboutUser;
	this.employerName =  employerName;
	this.collegeName= collegeName;
	this.mobileNumber= mobileNumber;
	this.lifeEvent= lifeEvent;
    this.musicName= musicName;
    this.sportName= sportName;
    this.showName= showName;
}

function DefaultProfile()	{
	this.aboutUser = UNDEFINED;
	this.employerName =  UNDEFINED;
	this.collegeName= UNDEFINED;
	this.mobileNumber= UNDEFINED;
	this.lifeEvent= UNDEFINED;
    this.musicName= UNDEFINED;
    this.sportName= UNDEFINED;
    this.showName= UNDEFINED;
}

function Friend(id, name)	{
	this.id = id; // Id will be User ID
	this.name = name;
}
	
function Group(id, name)	{ 
	this.id= id;
	this.name = name;
}

function getDefaultProfile()	{
	return new DefaultProfile();
}

exports.User = User;
exports.Profile = Profile;
exports.Friend = Friend;
exports.Group = Group;
exports.getDefaultProfile = getDefaultProfile;	
