var requirejs = require('requirejs'),	
	WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({port: 8080});

requirejs.config({
    nodeRequire: require
});

var table = requirejs('table')

//t.deal = function() {
//	console.log('intercept deal to show card distributed');
//	var updateseat = table_blackjack.prototype.deal.call(this);
//	if ( updateseat != null ) {
//		t.paint("#table_blackjack");					
//		this.deal();
//	}
//}

console.log('start table');
var t = new table();
t.id = 'remote';
console.log('table started');

t.addseat();
t.addseat();
t.addseat();
t.addseat();
var seats_clients = new Array(t.seats.length);
var seats_swkeys = new Array(t.seats.length);

console.log('start standard in');
var stdin = process.openStdin();
stdin.on('data', function(message) {
	var msg = message.toString().substring(0, message.length - 1);	
	console.log( '(' + wss.clients.length + ' connections) ' +  t.json() );
});

verify = function(seat, client) {
	console.log('verify:' + seat + ' ' + (seats_clients[seat] == client) + ' ' + (!t.seats[seat].player));
	return seats_clients[seat] == client || !t.seats[seat].player; 		
}

lost = function(old_key, new_key, client) {
	for (var x = 0; x < seats_swkeys.length; x++) {
		if ( seats_swkeys[x] == old_key ) {
			console.log('found lost player');
			seats_swkeys[x] = new_key;
			seats_clients[x] = client;
		}
	}
}

wss.on('connection', function(ws) {
	
	var swkey = ws.upgradeReq.headers['sec-websocket-key'];
	
	console.log(ws.upgradeReq.headers);	
	console.log(this.clients.length + ' connections');
	
	ws.stand = function(seat) {		
		console.info('client stand:' + seat);
		seats_clients[seat] = null; 
	}
	
	ws.sit = function(seat) {
		console.info('client sit:' + seat);
		seats_clients[seat] = ws;
		seats_swkeys[seat] = swkey;
	}
	
	ws.disconnect = function() {
		for (var x = 0; x < seats_clients.length; x++) {
			if ( seats_clients[x] == ws ) {
				console.info('client disconnect:' + t.json() );
				this.stand(x);				
			}
		}		 		
		if (true) {
			wss.tablecast();
		}
	}
    
	ws.on('message', function(message) {
    	console.log('received: %s', message.length == 0 ? '<blank>' : message );    	
    	var play = JSON.parse(message);
    	try {
    		if ( play.action == 'sit' ) {
    			t.act(play);
    			ws.sit(play.seat);    			
    		} else if ( verify(play.seat, ws) ) {
    			t.act(play);
    			if ( play.action == 'stand' ) {
    				ws.stand(play.seat)
    			}
    		} 
    		if (true) {
    			wss.tablecast();
    		}
    	} catch (err) {
    		console.log('error on message:' + err);
    	}

	});
    
    ws.on('close', function() {
        console.log('close');
        ws.disconnect();
    });
    
    if ( ws.upgradeReq.headers['cookie'] && ws.upgradeReq.headers['cookie'].match( '(^|;) ?swkey=([^;]*)(;|$)' ) ) {
    	var previous_swkey = unescape( ws.upgradeReq.headers['cookie'].match( '(^|;) ?swkey=([^;]*)(;|$)' )[2] );
    	lost(previous_swkey, swkey, ws);
    }
    ws.send(swkey);
    wss.tablecast();
});


wss.tablecast = function() {	
	console.log('tablecast');
	var filter = true;
	for(var i in this.clients) {
		console.log('client loop');//this.clients[i]);
		try {
			if (filter) {
				var f = t.json();
				f = JSON.parse(f);
				for (var x = 0; x < f.seats.length; x++ ) {
					if ( f.seats[x] && f.seats[x].options && !verify(x, this.clients[i]) ) {
						console.log('need to remove options');
						delete f.seats[x].options;
					}
				}								
				this.clients[i].send(JSON.stringify(f));
			} else {
				this.clients[i].send(t.json());
			}
	    } catch (err) {
	    	this.clients[i].close();
	    	console.log('error:' + err);
	    }        		
	}    	
};