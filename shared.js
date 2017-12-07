function generate_guid() {
	return null;
}

function RPC(port,method,data) {
	this.guid = generate_guid();
	this.port = port;
	var that = this;
	this.promise = new Promise(function(resolve,reject){
		that.handler = that.on_message_received.bind(that,resolve,reject);
		port.addEventListener('message',that.handler);
		port.postMessage({
			method: method,
			guid: that.guid,
			params: data
		});
	});
	return this;
}

RPC.prototype.on_message_received = function(resolve,reject,evnt) {
	debugger;
	if(evnt.data.responding_to === this.guid) {
		// guids match - this is a response!
		if(evnt.data.is_error) {
			reject(evnt.data.result);
		} else {
			resolve(evnt.data.result);
		}
		// run this only once.
		this.port.removeEventListener("message",this.handler);
	}
}

function RPCListener(port,obj) {
	this.obj = obj;
	this.port = port;
	port.addEventListener("message",this.on_message_received.bind(this));
	return this;
}

RPCListener.prototype.on_message_received = function(evnt) {
	var data = evnt.data;
	var method = data.method;
	var respond_to = data.guid;
	var promise = new Promise(this.obj[method].bind(this.obj,data.params));
	debugger;
	promise.then(function(value){
		console.log("Responding with",value);
		that.port.postMessage({
			responding_to: respond_to,
			result: value,
			is_error: false
		});
	}).catch(function(value){
		that.port.postMessage({
			responding_to: respond_to,
			result: value,
			is_error: true
		});
	});
}