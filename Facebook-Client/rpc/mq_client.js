var amqp = require('amqp');

var connection = amqp.createConnection({host:'localhost'});
var rpc = new (require('./amqprpc'))(connection);

function make_request(queue_name, msg_payload, callback){
	
	rpc.makeRequest(queue_name, msg_payload, function(err, response){
		/*console.log("Got the reply");
		console.log(response);
		console.log(err);*/
		
		if(err)	{
			//console.error(err);
		}
		else{
			//console.log("response"+ response);
			callback(response);
		}
	});
}

function close()	{
	connection.end();
}

exports.make_request = make_request;
exports.close = close;