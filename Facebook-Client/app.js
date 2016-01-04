
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var signInModule = require('./routes/signIn');
var signUpModule = require('./routes/signUp');
var userHandler = require('./routes/userHandler');
var groupHandler = require('./routes/groupHandler');

var mongoSessionStoreURL = "mongodb://localhost:27017/sessions";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var sessionDBHandler = require("./routes/sessionDBHandler");

//Initialize mongoDB and save the reference for other services to use.....
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/fb_db";
MongoClient.connect(url, function(err, _db){
	if (err) { throw new Error('Could not connect: '+err); }
    console.log("Successfully connectied to Mongo DB in Server");
    global.db = _db;
});


var mq_client = require('./rpc/mq_client');
global.mq_client = mq_client;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(expressSession({
	secret: '!Q2w#E4r%T6y&U8i(O0p',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionStoreURL
	})
}));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/partials/:name', routes.partials);
app.post('/signUp', signUpModule.signUp);
//app.post('/signIn', signInModule.signIn);
//app.get('/signOut', signOutModule.signOut);
require('./routes/routes')(app);
require('./routes/signIn')(app);
app.get('/', routes.login);
app.get('/homePage', routes.homePage);
app.get('/getUserDetails', userHandler.getUserDetails);
app.post('/updateUserInfo', userHandler.updateProfile);
app.post('/sendFriendRequest', userHandler.sendFriendRequest);
app.post('/acceptFriendRequest', userHandler.acceptFriendRequest);
app.post('/getFriendDetails' , userHandler.getFriendDetails);
app.post('/createGroup', groupHandler.createGroup);
app.post('/deleteGroup', groupHandler.deleteGroup);
app.post('/getGroupMembers', groupHandler.getGroupMembers);
app.post('/removeMembers', groupHandler.removeMembers);
app.get('/newsFeed', userHandler.getUpdates);

sessionDBHandler.connect(mongoSessionStoreURL, function(db) {
	http.createServer(app).listen(app.get('port'), function(){
		  console.log('Express server listening on port ' + app.get('port'));
		});	
});

process.on("SIGTERM" , function()	{
	mq_client.close();
});
