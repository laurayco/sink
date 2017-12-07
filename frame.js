/*
	frame.js:
		- client library for interfacing with worker.js
*/

function DataSink(schema) {
	this.schema = schema;
	this.worker = null;
	return this;
}

DataSink.prototype.initialize = function(worker_url) {
	this.worker = new SharedWorker(worker_url);
	//this.worker.port.addEventListener("message", this.handleWorkerMessage, false);
	this.worker.port.addEventListener("messageerror", this.handleWorkerError, false);
	this.worker.port.start();
}

DataSink.prototype.pulse = function(timeout) {
	var that = this;
	(new RPC(this.worker.port,'heartbeat','ping')).promise.then(function(response){
		setTimeout(that.pulse.bind(that,timeout), timeout);
	}).catch(function(response){
		console.error("Error with pulse",response);
	});
}

DataSink.prototype.request_data = function(query) {
	return (new RPC(this.worker.port,'request_data',query)).promise;
}

DataSink.prototype.handleWorkerMessage = function(e) {
	console.log(e);
}

DataSink.prototype.handleWorkerError = function(e) {
	console.error(e);
}