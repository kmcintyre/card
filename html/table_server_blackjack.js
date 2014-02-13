var requirejs = require('requirejs'),	
	WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({port: 8080});

requirejs.config({
    nodeRequire: require
});

var table_blackjack = requirejs('table_blackjack');
console.log('start table');

var t = new table_blackjack();
t.seats[0].player.name = 'Automatic 1-sec Delay';
t.id = 'remote';
t.title = '6 deck shoe';
t.shoe.cards[4].card = 'A';
console.log('table started');

t.locked = true;

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

sitting = function(client) {
	for (var x = 0; x < t.seats.length; x++ ) {
		if ( seats_clients[x] == client ) return true;
	}
	return false; 		
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
	//var start_with = (verifyDealer ? 0 : 1); // 0 filters dealer;
	var start_with = 0; // 0 filters dealer;		
	t.options();	
	for(var i in this.clients) {
		//console.log(JSON.stringify(t.simple()));//this.clients[i]);
		try {
			if (filter) {
				var f = t.simple();
				for (var x = start_with; x < f.seats.length; x++ ) {
					if ( f.seats[x].player ) {
						console.log('check seat:' + x + ' options length' + f.seats[x].options.length);
						if ( !verify(x, this.clients[i]) || ( x == 0 && f.seats[x].hand0 && f.seats[x].hand0.options && f.seats[x].hand0.options[0] == 'insurance' ) || ( t.seats[0].activeseat() != null && t.seats[0].activeseat() != x ) ) {
							console.log('remove seat options');
							delete f.seats[x].options;							
							for (var y = 0;; y++) {
								if ( f.seats[x]['hand' + y] && f.seats[x]['hand' + y].options[0] != 'insurance'  ) {
									delete f.seats[x]['hand' + y].options;
								} else {
									break;
								}
							}
						}  						 
					} else if ( sitting(this.clients[i]) ) {
						delete f.seats[x].options;
					} 					
				}
				console.log(JSON.stringify(f));
				this.clients[i].send(JSON.stringify(f));
			} else {
				this.clients[i].send(JSON.stringify(t.simple()));
			}
	    } catch (err) {
	    	this.clients[i].close();
	    	console.log('error:' + err);
	    }        		
	}    	
};

//t.act = function(step) {
//	console.log('intercept act');
//	table_blackjack.prototype.act.call(this, step);		
//	wss.tablecast();
//}

wss.on('connection', function(ws) {
	
	var swkey = ws.upgradeReq.headers['sec-websocket-key'];
	
	//console.log(ws);
	
	console.log(ws._socket.remoteAddress);
	console.log(ws.upgradeReq.headers);
	console.log(this.clients.length + ' connections');
	
    if ( ws.upgradeReq.headers['cookie'] && ws.upgradeReq.headers['cookie'].match( '(^|;) ?swkey=([^;]*)(;|$)' ) ) {
    	var previous_swkey = unescape( ws.upgradeReq.headers['cookie'].match( '(^|;) ?swkey=([^;]*)(;|$)' )[2] );
    	console.log('previous_swkey:' + previous_swkey);
    	lost(previous_swkey, swkey, ws);
    }
    ws.send(swkey);
    setTimeout( function() { wss.tablecast(); }, 750);
	
	ws.stand = function(seat) {		
		console.info('client stand:' + seat);
		delete t.seats[seat].player;
		seats_clients[seat] = null;
		seats_swkeys[seat] = null;
	}
	
	ws.sit = function(seat) {
		console.info('client sit:' + seat + ' with key:' + swkey);
		seats_clients[seat] = ws;
		seats_swkeys[seat] = swkey;
	}
	
	ws.disconnect = function() {
		for (var x = 0; x < seats_clients.length; x++) {
			if ( seats_clients[x] == ws ) {
				console.info('client disconnect:' + t.simple() );
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
    
});

console.log('start standard in');
var stdin = process.openStdin();
stdin.on('data', function(message) {
	var msg = parseInt(message.toString().substring(0, message.length - 1));
	if ( msg ) {
		if (t.seats[msg].hand() ) {
			if ( t.seats[0].activeseat() == msg ) {
				console.log('staying active hand');
				t.act({action:"stay", seat:msg});
				wss.tablecast();
			} 
		} else if (t.seats[msg].player) {
			if ( t.seats[msg].player.chips < t.minimum ) {
				console.log('stand dead player');
				t.act({action:"stand", seat:msg});
				wss.tablecast();
			}
		} else {
			console.log('no one at:' + msg);
			wss.tablecast();
		}
	}
	//console.log( t.simple() );
});

var quicktimer = null
var wait_a_bit = 0;

dealer = function(delay) { 
	//console.log('dealer check as:' + t.seats[0].activeseat() + ' options:' + t.seats[0].options() );
	try {
		if ( t.seats[0].activeseat() == null && t.seats[0].options().length > 0 && t.seats[0].options()[0] == 'deal' && !quicktimer ) {
			console.log('SEAT ACT:' + t.seats[0].options()[0]);
			quicktimer = setTimeout( function() { t.act({ action: t.seats[0].options()[0], seat: 0 }); wss.tablecast(); quicktimer = null; }, 5000);
		} else if ( t.seats[0].activeseat() == 0 && !quicktimer ) {
			console.log('HAND ACT:' + t.seats[0].hand0.options()[0]);
			if ( t.seats[0].hand0.options()[0] == 'insurance' ) {
				quicktimer = setTimeout( function() { t.act({ action: t.seats[0].hand0.options()[0], seat: 0 }); wss.tablecast(); quicktimer = null; }, 5000);
			} else {
				quicktimer = setTimeout( function() { t.act({ action: t.seats[0].hand0.options()[0], seat: 0 }); wss.tablecast(); quicktimer = null; }, 1000);
			}
		} else {
			//console.log(t.seats[0].options().length + ' options as:' + t.seats[0].activeseat());
		}
	} catch (err) {
		console.log(err);
	}
	setTimeout( function() { dealer(delay); }, delay );
	
}



keepalive = function(delay) {
	wss.tablecast();
	setTimeout( function() { keepalive(delay); }, delay );
}
dealer(1000);
keepalive(60000);