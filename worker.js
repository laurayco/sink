/*
	worker.js:
		- manages indexeddb as a cache
		- manages connection to server
			to provide up to date data.
*/

self.importScripts('/shared.js');

function WorkerDataSink() {
	return this;
}

WorkerDataSink.prototype.on_connect = function(e) {
	var port = e.ports[0];
	port.listener = new RPCListener(port,this);
	port.start();
}

WorkerDataSink.prototype.heartbeat = function(params,resolve,reject) {
	console.log("Worker receieved",params);
	var LUT = {
		'ping':'pong',
		'pong':'ping'
	};
	resolve(LUT[params]);
}

var sink = new WorkerDataSink();

self.addEventListener("connect", sink.on_connect.bind(sink));