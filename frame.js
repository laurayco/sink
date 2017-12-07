/*
	frame.js:
		- client library for interfacing with worker.js
*/

function DataSink(schema) {
	this.schema = schema;
	this.worker = null;
	return this;
}

DataSink.prototype.initialize = function() {
	this.worker = new SharedWorker("/worker.js");
	//this.worker.port.addEventListener("message", this.handleWorkerMessage, false);
	this.worker.port.addEventListener("messageerror", this.handleWorkerMessage, false);
	this.worker.port.start();
}

DataSink.prototype.request_data = function(query) {
	var rpc = new RPC(this.worker.port,'heartbeat','ping');
	rpc.promise.then(function(response){
		console.log("Frame received",response);
	}).catch(function(response){
		console.error("Frame receieved",response);
	});
}

DataSink.prototype.handleWorkerMessage = function(e) {
	console.log(e);
}