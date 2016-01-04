
var amqp = require('amqp')
, util = require('util');

var signInModule = require('./services/signin');
var signUpModule = require('./services/signUp');
var userModule = require('./services/user');
var groupModule = require('./services/group');

//Initialize mongoDB and save the reference for other services to use.....
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/fb_db";
MongoClient.connect(url, function(err, _db){
	if (err) { throw new Error('Could not connect: '+err); }
    console.log("Successfully connectied to Mongo DB in Server");
    global.db = _db;
});

//Initialize RabbitMQ connection
var connection = amqp.createConnection({host:'localhost'});

connection.on('ready', function(){
	
	console.log("listening on signup_req_queue");
	connection.queue('signup_req_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			
			util.log(util.format( deliveryInfo.routingKey, message));
			/*util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));*/
			
			signUpModule.signUp(message, function(response){

				//console.log("pulishing to signup_reply_queue");
				//return index sent
				connection.publish(m.replyTo, response, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});

	console.log("listening on signin_req_queue");
	connection.queue('signin_req_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			
			/*util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));*/
			
			signInModule.signIn(message, function(response){

				//console.log("pulishing to signin_reply_queue");
				//return index sent
				connection.publish(m.replyTo, response, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});		
	});
	
	console.log("listening on user_req_queue");
	connection.queue('user_req_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			
			/*util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));*/
			
			userModule.handle_request(message, function(response){

				//console.log("pulishing to user_reply_queue");
				//return index sent
				connection.publish(m.replyTo, response, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});				
	});

	console.log("listening on user_req_queue");
	connection.queue('group_req_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			
			/*util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));*/
			
			groupModule.handle_request(message, function(response){

				//console.log("pulishing to user_reply_queue");
				//return index sent
				connection.publish(m.replyTo, response, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});				
	});	
});
