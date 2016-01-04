
var homePage = angular.module("HomePage", ['ngRoute']);

homePage.config(function($routeProvider, $locationProvider)	{
	$routeProvider
	.when('/displayProfile', {
		templateUrl : 'partials/displayProfile'
	})
	.when('/editProfile',	{
		templateUrl : 'partials/editProfileForm',
		controller : 'EditProfileCtrl'
	})
	.when("/newsFeed",	{
		templateUrl: "partials/newsFeed"
	})
	.when("/createGroup",	{
		templateUrl: "partials/createGroupForm"
	})
	.when("/deleteGroup", {
		templateUrl: "partials/deleteGroupsForm" // Reason I have this option as part of groups is because user can delete multiple groups at the same time
	})
	.when("/displayMyFriends",	{
		templateUrl: "partials/displayMyFriends"
	})
	.when("/showMembers", 	{
		templateUrl: "partials/showGroupMembers"
	})
	.when("/removeMembers",	{
		templateUrl: "partials/removeFromGroup"
	})
	.otherwise({
		redirectTo: "/displayProfile"
	});
});

homePage.service("User", function($http) {
	
	function User(userID, firstName, lastName, friends, friendRequestsSent, friendRequestsRecieved, joinedGroups, suggestedFriends)	{
		this.userID = userID;
		this.firstName = firstName;
		this.lastName = lastName;
		this.friends = friends;
		this.friendRequestsSent = friendRequestsSent;
		this.friendRequestsRecieved = friendRequestsRecieved;
		this.joinedGroups = joinedGroups;
		this.suggestedFriends = suggestedFriends;
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

	function Friend(id, name)	{
		this.id = id;
		this.name = name;
	}
	
	function Group(id, name)	{ 
		this.id= id;
		this.name = name;
	}
	
	this.curGroup = "";
	this.isProfileLoaded = false;
	var self = this;
	this.profilePromise = $http.get("/getUserDetails").then(function(response)	{
		var data = response.data;
		
		var user = JSON.parse(data.userData);
		self.user = new User(user.userID, user.firstName, user.lastName, user.friends, user.friendRequestsSent, 
				user.friendRequestsRecieved, user.joinedGroups, user.suggestedFriends);

		var profile = JSON.parse(data.profileData);
		self.profile = new Profile(profile.aboutUser, profile.employerName, profile.collegeName, profile.mobileNumber, profile.lifeEvent,
				profile.musicName, profile.sportName, profile.showName);
		
		self.isProfileLoaded = true;
		var combinedData = {
				"User" : self.user,
				"Profile" : self.profile
		};
		return combinedData;
	}, function()	{
	});
	
	this.setCurrGroup = function(groupID)	{
		this.curGroup = groupID;
	};
	
	this.getCurrGroup = function()	{
		return this.curGroup;
	};
	
	this.getUserFirstName = function (clientCallBack)	{
		if(!this.isProfileLoaded)	{
			this.profilePromise.then(function(data) {
				clientCallBack(data.User.firstName);
			});									
		}else	{
			clientCallBack(this.user.firstName);
		}		
	};
	
	this.getUserLastName = function ()	{
		if(!this.isProfileLoaded)	{
			this.profilePromise.then(function(data) {
				clientCallBack(data.User.lastName);
			});									
		}else	{
			clientCallBack(this.user.lastName);
		}		
	};
	
	this.getUserId	 = function(){
		if(!this.isProfileLoaded)	{
			this.profilePromise.then(function(data) {
				clientCallBack(data.User.userId);
			});									
		}else	{
			clientCallBack(this.user.userId);
		}		
	};
	
	this.getCurrentFriends = function (clientCallBack)	{
		if(!this.isProfileLoaded)	{
			this.profilePromise.then(function(data) {
				clientCallBack(data.User.friends);
			});									
		}else	{
			clientCallBack(this.user.friends);
		}			
	};
	
	this.getFriendRequestsSent = function(clientCallBack)	{
		if(!this.isProfileLoaded)	{
			this.profilePromise.then(function(data) {
				clientCallBack(data.User.friendRequestsSent);
			});									
		}else	{
			clientCallBack(this.user.friendRequestsSent);
		}		
	};

	this.getFriendRequestsReceived = function(clientCallBack)	{
		if(!this.isProfileLoaded)	{
			this.profilePromise.then(function(data) {
				clientCallBack(data.User.friendRequestsRecieved);
			});									
		}else	{
			clientCallBack(this.user.friendRequestsRecieved);
		}		
	};
	
	this.getJoinedGroups = function (clientCallBack)	{
		if(!this.isProfileLoaded)	{
			this.profilePromise.then(function(data) {
				clientCallBack(data.User.joinedGroups);
			});									
		}else	{
			clientCallBack(this.user.joinedGroups);
		}		
	};
	
	this.getSuggestedFriends = function(clientCallBack)	{
		if(!this.isProfileLoaded)	{
			this.profilePromise.then(function(data) {
				clientCallBack(getFilteredSuggestedFriends(data.User));
			});									
		}else	{
			
			clientCallBack(getFilteredSuggestedFriends(this.user));
		}				
	};
	
	function getFilteredSuggestedFriends(user)	{
		var sugFriends = user.suggestedFriends;
		/*var suggestedFriends = [];
		for(var i =0;i<sugFriends.length ;i++)	{
			var suggestedID = sugFriends[i].id;
			console.log(suggestedID);
			if(suggestedID != user.userID && !(suggestedID in user.friendRequestsRecieved) && !(suggestedID in user.friendRequestsSent))	{
				suggestedFriends.push(sugFriends[i]);
			}
		}*/
		return sugFriends;
	}
	
	this.updateUserProfile = function(aboutUser, employerName, collegeName, mobileNumber, lifeEvent, musicName, sportName, showName)	{
		this.profile.aboutUser = aboutUser;
		this.profile.employerName =  employerName;
		this.profile.collegeName= collegeName;
		this.profile.mobileNumber= mobileNumber;
		this.profile.lifeEvent= lifeEvent;
	    this.profile.musicName= musicName;
	    this.profile.sportName= sportName;
	    this.profile.showName= showName;	
	};
	
	this.updateJoinedGroups = function(updatedJoinedGroups)	{
		this.user.joinedGroups = updatedJoinedGroups; 
	};
	
	this.getUserProfile = function(clientCallBack)	{
		if(!this.isProfileLoaded)	{
			this.profilePromise.then(function(data) {
				clientCallBack(data.Profile);
			});									
		}else	{
			clientCallBack(this.profile);
		}
	};

	this.sendFriendReq = function(friendID, callback)	{
		var _this = this;
		/*Make a call to server to save the friend userID in current user table in the column of requests sent and also add a request received in the column of requests
		 * received of the friend user id*/
		$http.post('/sendFriendRequest',	{
			'newFriendID':friendID,
			'totalSentFriendReq':JSON.stringify(this.user.friendRequestsSent) // 2 quiries 1 will update it in my friends list, 
		}).then(function(response)	{
			_this.user.friendRequestsSent.push(friendID);
			callback(response);
		},function(err)	{			
		});
	};
	
	this.acceptFriendReq = function(friendID, callback)	{
		var _this = this;
		/*Make a call to server to save the friend userID in current user table in the column of friends and also add a request received in the column of requests
		 * received of the friend user id*/
		$http.post('/acceptFriendRequest',	{
			'newFriendID':friendID,
			'currFriendsList':JSON.stringify(this.user.friends) // 2 queries should be perfomed in the server 1 to add to friend another 1 to add it to myself
		}).then(function(response)	{
			_this.user.friends.push(friendID);			
			callback(response);
		},function(err)	{			
		});		
	}
});

/*	As part of this controller fetch
 * 	1. User Details
 * 2. Number friend requests user might have got
 * 3. Implement Sign Out Functionality of this user
 * 4. Implement a functionality to accept friends request (think of how to display message saying friend request accepted)
 * */
homePage.controller("PageHeaderCtrl", function($scope, $http, $window, User)	{
	$scope.friendReq = [];
	User.getFriendRequestsReceived(function(numberOfRequests) {
		if(numberOfRequests.length > 0)	{
			$http.post("/getFriendDetails", {
				"friendID":JSON.stringify(numberOfRequests)
			}).then(function(response) {
				var data = response.data;
				var friendreq = JSON.parse(data.friends);
				$scope.numberOfFriendRequests = friendreq.length;
				$scope.friendReq = friendreq;
			}, function(err) {
			});			
		}
	});
	
	$scope.signOut = function()	{
		window.location.assign('/signOut'); 				
	}; 
	
	$scope.acceptFriend = function(friend){
		User.acceptFriendReq(friend.id, function(response)	{
			if(response.data.error)	{
				alert("Unexpected issue, please try again");
			}else	{
				$scope.numberOfFriendRequests = $scope.numberOfFriendRequests-1;
				if($scope.numberOfFriendRequests == 0)	{
					$scope.numberOfFriendRequests = "";
				}
				var unAcceptedFriends = [];
				var index = 0;
				for(var i=0;i<$scope.friendReq.length;i++)	{
					if(friend.id != $scope.friendReq[i].id)	{
						unAcceptedFriends[index++] = $scope.friendReq[i]; 
					}
				}
				$scope.friendReq = unAcceptedFriends;
				alert("Friend Request accepted");				
			}
		});
	};
});

/*	As part of this controller fetch
 * 	1. Fetch information of all the groups this user is registered with 
 * */
homePage.controller("PageContentCtrl", function($scope, $http, User){

	$scope.curGroup = "";
	$scope.accountUser = "";
	$scope.currUserGroups = [];
	
	User.getUserFirstName(function(username){
		$scope.accountUser = username;
	});
	
	User.getJoinedGroups(function(joinedGroups) {
		$scope.currUserGroups = joinedGroups;		
	});
	
	$scope.currentGroup = function(groupID)	{
		User.setCurrGroup(groupID);
	};
});

homePage.controller("FriendsDisplayCtrl", function($scope, $http, User)	{
	$scope.friendsAvailable = false;
	$scope.myFriendsList = [];
	
	User.getCurrentFriends(function(friends)	{
		if(friends.length > 0)	{
			$http.post("/getFriendDetails", {
				"friendID":JSON.stringify(friends)
			}).then(function(response) {
				var data = response.data;
				var friendreq = JSON.parse(data.friends);
				$scope.myFriendsList = friendreq;
				$scope.friendsAvailable = true;					
			}, function(err) {
			});					
		}
	});
});

/*This controller takes care of sending friend requests and updating the button with
 * friend request sent*/
homePage.controller("AvailableFriendsCtrl", function($scope, $http, $window, User)	{
	
	$scope.friends = [];
	
	User.getSuggestedFriends(function(suggestedFriends) {
		$scope.friends = suggestedFriends;
	});
	
	$scope.sendFriendReq = function(friend)	{
		User.sendFriendReq(friend.id, function(response)	{
			if(response.data.error)	{
				alert("Unexpected issue, please try again");
			}else	{
				var updatedList = [];
				for(var i =0;i<$scope.friends.length;i++)	{
					if(!($scope.friends[i].id == friend.id))	{
						updatedList.push($scope.friends[i]);
					}
				}
				$scope.friends = updatedList;
				alert("Friend Request Sent");				
			}			
		});
	}
});

homePage.controller("CreateGroupCtrl", function($scope, $http, User)	{
	User.getCurrentFriends(function(currentFriends) {
		if(currentFriends.length > 0)	{
			$http.post("/getFriendDetails", {
				"friendID":JSON.stringify(currentFriends)
			}).then(function(response) {
				var data = response.data;
				$scope.friends = JSON.parse(data.friends);
				$scope.friendsAvailable = true;				
			}, function(err) {
			});
		}
	})
	
	$scope.createGroup = function()	{
		$scope.groupCreated = false;
		$http.post("/createGroup", {
			"groupName":$scope.newGroupName,
			"groupMembers":JSON.stringify($scope.friendsToBeAdded)
		}).then(function(response) {
				var data = response.data;
				$scope.$parent.currUserGroups.push({"name" : $scope.newGroupName, "id" : data.groupID});
				User.updateJoinedGroups($scope.$parent.currUserGroups);
				$scope.groupCreated = true;
		}, function(err) {		
		});
	};
	
	$scope.friendsToBeAdded = [];
	
	$scope.addGroupMember = function(friend)	{
		$scope.friendsToBeAdded.push(friend);
	}
});

homePage.controller("DeleteGroupCtrl", function($scope, $http, User)	{
	$scope.groupsAvailable = false;
	
	User.getJoinedGroups(function(joinedGroups) {
		if(joinedGroups.length > 0)	{
			$scope.groupsList = joinedGroups;
			$scope.groupsAvailable = true;
		}		
	});
		
	
	$scope.groups2Delete = [];
	
	$scope.deleteGroup = function()	{
		$http.post("/deleteGroup", {
			"groups": JSON.stringify($scope.groups2Delete)
		}).then(function(response) {
			var data = response.data;
			var runtime = JSON.parse(data.remainingGroups);
			$scope.$parent.currUserGroups.length = 0;
			$scope.groupsList = [];
			for(var i =0 ; i<runtime.length;i++)	{
				$scope.$parent.currUserGroups.push({"id":runtime[i].id,	  
					"name":runtime[i].name});
				$scope.groupsList.push({"id":runtime[i].id,	  
					"name":runtime[i].name});
			}		
			User.updateJoinedGroups($scope.currUserGroups);			
			if($scope.groupsList.length == 0)	{
				$scope.groupsAvailable = false;				
			}
			$scope.groups2Delete = [];
		}, function(error) {			
		});
	};
	
	$scope.addGroup2Delete = function(group)	{
		if($scope.groups2Delete.length == 0)	{
			$scope.groups2Delete.push(group);
			return;
		}

		var present = false;
		for(var i=0 ; i<$scope.groups2Delete.length ; i++)	{
			if(group == $scope.groups2Delete[i])	{
				present = true;
			}
		}
		if(!present)	{
			$scope.groups2Delete.push(group);
		}else	{
			var runtime = [];
			for(var i=0 ; i<$scope.groups2Delete.length ; i++)	{
				if(group != $scope.groups2Delete[i])	{
					runtime[i] = $scope.groups2Delete[i];
				}
			}
			$scope.groups2Delete = runtime;
		}
	};
});

homePage.controller("ShowGroupMembersCtrl", function($scope, $http, User)	{
	$scope.groupMembers = [];
	var curGroup = User.getCurrGroup();
	$http.post("/getGroupMembers", {
		"groupID":curGroup
	}).then(function(response) {
			var data = response.data;
			$scope.groupMembers = JSON.parse(data.groupMembers);
	}, function(reason) {		
	});
});

homePage.controller("RemoveMembersCtrl", function($scope, $http, User)	{

	$scope.membersAvailable = true;
	
	var curGroup = User.getCurrGroup();
	$http.post("/getGroupMembers", {
		"groupID":curGroup
	}).then(function(response) {
			var data = response.data;
			$scope.groupMembers = JSON.parse(data.groupMembers);
			if($scope.groupMembers.length == 0)	{
				$scope.membersAvailable = false;
			}else	{
				$scope.membersAvailable = true;
			}
	}, function(reason) {		
	});
	
	$scope.membersToRemove = [];
	$scope.onMemberSelect = function(friend)	{
		if($scope.membersToRemove.length == 0)	{
			$scope.membersToRemove.push(friend.id);
			return;
		}

		var present = false;
		for(var i=0 ; i<$scope.membersToRemove.length ; i++)	{
			if(friend.id == $scope.membersToRemove[i])	{
				present = true;
			}
		}
		if(!present)	{
			$scope.membersToRemove.push(friend.id);
		}else	{
			var runtime = [];
			for(var i=0 ; i<$scope.membersToRemove.length ; i++)	{
				if(friend.id != $scope.membersToRemove[i])	{
					runtime[i] = $scope.membersToRemove[i];
				}
			}
			$scope.membersToRemove = runtime;
		}		
	};
	
	$scope.removeFromGroup = function()	{
		$http.post("/removeMembers", {
			"groupID":User.getCurrGroup(),
			"members":JSON.stringify($scope.membersToRemove)
		}).then(function(response){
			var temp = $scope.groupMembers;
			var runtime = [];
			for(var i=0;i<temp.length;i++)	{
				var present = false;
				for(var j = 0;j<$scope.membersToRemove.length;j++)	{
					if(temp[i].id == $scope.membersToRemove[j])	{
						present = true;
						break;
					}					
				}
				if(present == false)	{
					runtime.push(temp[i]);
				}
			}
			$scope.groupMembers.length = 0;
			
			for(var i = 0;i<runtime.length;i++)	{
				$scope.groupMembers.push(runtime[i]);
			}
		},function(err)	{			
		});
	}
});

homePage.controller("DisplayProfileCtrl", function($scope, $http, User)	{
		User.getUserProfile(function(userProfile)	{
			$scope.aboutUser = userProfile.aboutUser;
			$scope.employerName = userProfile.employerName;
			$scope.collegeName =userProfile.collegeName;
			$scope.mobileNumber = userProfile.mobileNumber;
			$scope.lifeEvent = userProfile.lifeEvent;
			$scope.musicName = userProfile.musicName;
			$scope.sportName =userProfile.sportName;
			$scope.showName = userProfile.showName;			
		});		
//Copy the data from User object to this Scope, since user object will be updated when ever user edits the profile we dont need to make db request and we are good...
});

homePage.controller("NewsFeedCtrl", function($scope, $interval, $http, User) {
		
        $interval(function() {

           $http.get('/newsFeed').then(function(response) {

              $scope.feeds = JSON.parse(response.data.updates);

           },function(data) {
           });

        }, 12000);	
});

homePage.controller("EditProfileCtrl", function($scope, $http, User)	{
	$scope.profileUpdated = false;
	
	User.getUserProfile(function(userProfile)	{
		$scope.aboutUser = userProfile.aboutUser;
		$scope.employerName = userProfile.employerName;
		$scope.collegeName =userProfile.collegeName;
		$scope.mobileNumber = userProfile.mobileNumber;
		$scope.lifeEvent = userProfile.lifeEvent;
		$scope.musicName = userProfile.musicName;
		$scope.sportName =userProfile.sportName;
		$scope.showName = userProfile.showName;			
	});
	
	//As part of this controller initialization copy the userinfo data from User object to this scope.....
	
	$scope.updateUserInfo = function()	{
		$http.post("/updateUserInfo", {
			'aboutUser': $scope.aboutUser, 
			'employerName': $scope.employerName,
			'collegeName': $scope.collegeName,
			'mobileNumber': $scope.mobileNumber,
			'lifeEvent': $scope.lifeEvent,
		    'musicName': $scope.musicName,
		    'sportName': $scope.sportName,
		    'showName': $scope.showName
		}).then(function(response)	{
			$scope.profileUpdated = response.data.isUpdateSuccessfull;
			//On success I also update my local copy of User to service the same data when user wants to see the profile, thus I avoid requesting DB again.
			if(response.data.isUpdateSuccessfull)	{
				User.updateUserProfile($scope.aboutUser, $scope.employerName, $scope.collegeName, $scope.mobileNumber, $scope.lifeEvent, 
						$scope.musicName, $scope.sportName, $scope.showName);
			}
		}, function(err)	{
		});
	};	
});
