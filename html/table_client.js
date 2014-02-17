define(function() {
	
	var tablesocket = new WebSocket("ws://dev.nwice.com:8080");
	
	tablesocket.key = null;	
	tablesocket.onopen = function(evt) { 
		console.log('open')
		console.log(evt); 
	};
	tablesocket.onclose = function(evt) { console.log('disconnect:' + evt.code); console.log(evt); };
	tablesocket.onerror = function(evt) { console.log("error"); console.log(evt); };
	
	tablesocket.tablecast = function(o) {
		console.warn('should override')		
	}

	tablesocket.onmessage = function(evt) { 
		console.log('message:' + evt + " data:" + evt.data);
		try {
			tablesocket.tablecast(JSON.parse(evt.data));
		} catch (err) {
			console.log('error?:' + err);
			console.log('assuming swkey:' + evt.data);
			document.cookie = "swkey=" + escape(evt.data);
			console.log('did the cookie get set');
		}
	};
	
	function table_client() {}
	
	table_client.prototype.send = function(json) {
		tablesocket.send(JSON.stringify(json));
	}
	
	table_client.prototype.set = function(f) {
		tablesocket.tablecast = f; 		
	}
	
	return table_client;
	
});