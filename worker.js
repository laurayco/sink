/*
	worker.js:
		- manages indexeddb as a cache
		- manages connection to server
			to provide up to date data.
*/

self.importScripts('/shared.js');

function WorkerDataSink() {
	this.lastContacts = {};
	return this;
}

WorkerDataSink.prototype.on_connect = function(e) {
	var port = e.ports[0];
	this.lastContacts[port] = new Date();
	port.listener = new RPCListener(port,this);
	port.start();
}

WorkerDataSink.prototype.request_data = function(params,resolve,reject) {
	resolve(params);
}

WorkerDataSink.prototype.heartbeat = function(params,resolve,reject) {
	var LUT = {
		'ping':'pong',
		'pong':'ping'
	};
	resolve(LUT[params]);
}

var sink = new WorkerDataSink();

self.addEventListener("connect", sink.on_connect.bind(sink));