var requirejs = require('requirejs'),	
	WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({port: 8080});

requirejs.config({
    nodeRequire: require
});

var table_blackjack = requirejs('table_blackjack');

console.log('start table');

var t = new table_blackjack();
t.id = 'remote';

//intercept = t.shoe.next;
//t.shoe.next = function(seat) {
//	console.log('intercept shoe:' + seat);	
//	return intercept();
//} 

console.log('table started');

t.addseat();
t.addseat();
t.addseat();
t.addseat();
//t.addseat();
//t.addseat();

var seats_clients = new Array(t.seats.length);
var seats_swkeys = new Array(t.seats.length);

var verifyDealer = true;
/*
 * check seat for client but also allow for no player sitting 
 */
verify = function(seat, client) {
	console.log('verify:' + seat + ' ' + (seats_clients[seat] == client) + ' ' + (!t.seats[seat].player)) + ' ' + (!verifyDealer && seat == 0);
	return seats_clients[seat] == client || !t.seats[seat].player || (!verifyDealer && seat == 0); 		
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

wss.tablecast = function() {	
	console.log('tablecast:' + this.clients.length);
	
	var filter = true;	
	var start_with = (verifyDealer ? 0 : 1); // 0 filters dealer;	
	t.options();	
	for(var i in this.clients) {
		console.log('client loop');//this.clients[i]);
		try {
			if (filter) {
				var f = t.json();
				f = JSON.parse(f);
				for (var x = start_with; x < f.seats.length; x++ ) {
					if ( f.seats[x] && f.seats[x].options && !verify(x, this.clients[i]) ) {
						console.log('need to remove options');
						delete f.seats[x].options;
					} 					
					if ( f.seats[x] ) {
						var splits = 0;
						try {
							while ( f.seats[x]['hand' + splits] ) {
								var h = { cards: f.seats[x]['hand' + splits].cards, bet: f.seats[x]['hand' + splits].bet, insurance: f.seats[x]['hand' + splits].insurance   };								
								f.seats[x]['hand' + splits] = h; 							
								splits++;
							}
						} catch (err) {
							console.log('filter split error:' + err);
						}
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

t.act = function(step) {
	console.log('intercept act');
	table_blackjack.prototype.act.call(this, step);		
	wss.tablecast();
}

wss.on('connection', function(ws) {
	
	var swkey = ws.upgradeReq.headers['sec-websocket-key'];
	
	//console.log(ws);
	
	console.log(ws._socket.remoteAddress);
	console.log(ws.upgradeReq.headers);
	console.log(this.clients.length + ' connections');
	
	ws.stand = function(seat) {		
		console.info('client stand:' + seat);
		if ( !t.seats[seat].player ) {
			seats_clients[seat] = null;
		}
	}
	
	ws.sit = function(seat) {
		console.info('client sit:' + seat + ' with key:' + swkey);
		seats_clients[seat] = ws;
		seats_swkeys[seat] = swkey;
	}
	
	ws.disconnect = function() {
		for (var x = 0; x < seats_clients.length; x++) {
			if ( seats_clients[x] == ws ) {
				console.info('client disconnect:' + t.json() );
				try {
					t.act( { seat: x, action : 'stand'} );
					this.stand(x);
				} catch (err) {
					console.log('disconnect but cannot stand:' + err);
				}
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
    	console.log('previous_swkey:' + previous_swkey);
    	lost(previous_swkey, swkey, ws);
    }
    ws.send(swkey);
    setTimeout( function() { wss.tablecast(); }, 100);
});

console.log('start standard in');
var stdin = process.openStdin();
stdin.on('data', function(message) {
	var msg = message.toString().substring(0, message.length - 1);	
	console.log( t.json() );
});

var wait_a_bit = 0;

dealer = function(delay) { 
	t.options();	
	if (t.seats[0].options.length == 1  ) {
		if ( t.seats[0].options[0] == 'insurance' || t.seats[0].options[0] == 'deal' ) {
			if ( wait_a_bit < 10 ) {
				console.log("wait for:" + t.seats[0].options[0]);
				wait_a_bit = wait_a_bit + 1;
			} else {
				wait_a_bit = 0
				t.act( { action: t.seats[0].options[0], seat: 0 } );
				wss.tablecast();
			}
		} else {
			t.act( { action: t.seats[0].options[0], seat: 0 } );
			wss.tablecast();
		}
	} else {
		//console.info( 'bored dealer' );
	}
	setTimeout( function() { dealer(delay); }, delay );
}

keepalive = function(delay) {
	wss.tablecast();
	setTimeout( function() { keepalive(delay); }, delay );
}
dealer(1000);
keepalive(60000);