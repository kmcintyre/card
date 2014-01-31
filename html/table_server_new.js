var requirejs = require('requirejs'),	
	WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({port: 8080});

requirejs.config({
    nodeRequire: require
});

var tables = new Array();

function findtable(id) {
	for (var x = 0; x < tables.length; x++) {
		if ( tables[x][0].id == id ) {
			return tables[x][0];
		}
	}
}

function addtable(t) {
	t.act = function(step) {
		console.log('intercept act');
		table.prototype.act.call(this, step);		
		wss.tablecast();
	}
	tables[tables.length] = t;
}

var table = requirejs('table');
console.log('start table');
addtable(new table());


wss.tablecast = function() {	
	console.log('tablecast:' + this.clients.length);
};

wss.on('connection', function(ws) {
	
	var swkey = ws.upgradeReq.headers['sec-websocket-key'];
	
	//console.log(ws);
	
	console.log(ws._socket.remoteAddress);
	console.log(ws.upgradeReq.headers);
	console.log(this.clients.length + ' connections');
	
    if ( ws.upgradeReq.headers['cookie'] && ws.upgradeReq.headers['cookie'].match( '(^|;) ?swkey=([^;]*)(;|$)' ) ) {
    	var previous_swkey = unescape( ws.upgradeReq.headers['cookie'].match( '(^|;) ?swkey=([^;]*)(;|$)' )[2] );
    	console.log('previous_swkey:' + previous_swkey);
    	//lost(previous_swkey, swkey, ws);
    }
    ws.send(swkey);
    setTimeout( function() { wss.tablecast(); }, 100);	
	
	ws.disconnect = function() {
		console.log('disconnect');
	}
    
	ws.on('message', function(message) {
    	console.log('received: %s', message.length == 0 ? '<blank>' : message );    	    	
    	var play = JSON.parse(message);
    	console.log(play);
	});
    
    ws.on('close', function() {
        console.log('close');
        ws.disconnect();
    });
    
});

console.log('start standard in');
var stdin = process.openStdin();
stdin.on('data', function(message) {
	var msg = message.toString().substring(0, message.length - 1);	
	console.log( t.simple() );
});

