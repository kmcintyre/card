var requirejs = require('requirejs'),	
	WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({port: 8080});

requirejs.config({
    nodeRequire: require
});

var table_blackjack = requirejs('table_blackjack');
console.log('start table');

var remote_bj = new table_blackjack(8);
remote_bj.seats[0].player.name = 'otto';
remote_bj.id = 'remote';
remote_bj.title = '6 deck shoe';
remote_bj.shoe.cards[4].card = 'A';
remote_bj.minimum = 25;
remote_bj.maximum = 1000;
console.log('table started');

remote_bj.locked = true;

var seats_clients = new Array(remote_bj.seats.length);
var seats_swkeys = new Array(remote_bj.seats.length);
var verifyDealer = true;

/*
 * check seat for client but also allow for no player sitting 
 */
verify = function(seat, client) {
	console.log('verify:' + seat + ' ' + (seats_clients[seat] == client) + ' ' + (!remote_bj.seats[seat].player)) + ' ' + (!verifyDealer && seat == 0);
	return seats_clients[seat] == client || !remote_bj.seats[seat].player || (!verifyDealer && seat == 0); 		
}

sitting = function(client) {
	for (var x = 0; x < remote_bj.seats.length; x++ ) {
		if ( seats_clients[x] == client ) return true;
	}
	return false; 		
}

var tablecaststamp = null;
var filter = true;
var start_with = 0; // 0 filters dealer;

wss.tablecast = function() {	
	tablecaststamp = new Date();
	console.log('tablecast: at:' + tablecaststamp + ' client length' + this.clients.length);
	remote_bj.options();	
	for(var i in this.clients) {
		//console.log(JSON.stringify(remote_bj.simple()));//this.clients[i]);
		try {
			if (filter) {
				var f = remote_bj.simple();
				for (var x = start_with; x < f.seats.length; x++ ) {
					if ( f.seats[x].player ) {
						console.log('check seat:' + x + ' options length' + f.seats[x].options.length);
						if ( !verify(x, this.clients[i]) || ( x == 0 && f.seats[x].hand0 && f.seats[x].hand0.options && f.seats[x].hand0.options[0] == 'insurance' ) || ( remote_bj.seats[0].activeseat() != null && remote_bj.seats[0].activeseat() != x ) ) {
							console.log('remove seat options');
							delete f.seats[x].options;							
							for (var y = 0;; y++) {
								if ( f.seats[x]['hand' + y] && f.seats[x]['hand' + y].options[0] != 'insurance'  ) {
									console.log('remove hand options');
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
				this.clients[i].send(JSON.stringify(remote_bj.simple()));
			}
	    } catch (err) {
	    	this.clients[i].close();
	    	console.log('error:' + err);
	    }        		
	}    	
};

//remote_bj.act = function(step) {
//	console.log('intercept act');
//	table_blackjack.prototype.acremote_bj.call(this, step);		
//	wss.tablecast();
//}


lost = function(old_key, new_key, client) {
	console.log('reconnecting!!!');
	for (var x = 0; x < seats_swkeys.length; x++) {
		if ( seats_swkeys[x] == old_key ) {
			console.log('found lost player');
			seats_swkeys[x] = new_key;
			seats_clients[x] = client;
		}
	}
}

lookup = function(swkey, ws) {
	return { name: 'Anonymous', chips: 5000 };
}

sit = function(seat, ws, swkey) {
	console.info(ws + ' client sit:' + seat + ' with key:' + swkey);
	remote_bj.act({action: 'sit', seat: seat, person:lookup(swkey, ws)});
	seats_clients[seat] = ws;
	seats_swkeys[seat] = swkey;
}

stand = function(seat, ws, swkey) {		
	console.info('client stand:' + seat + ' key:' + swkey);
	
	seats_clients[seat] = null;
	seats_swkeys[seat] = null;
}

wss.on('connection', function(ws) {
	
	var swkey = ws.upgradeReq.headers['sec-websocket-key'];
	console.log('swkey:' + swkey);

	if ( ws.upgradeReq.headers['cookie'] && ws.upgradeReq.headers['cookie'].match( '(^|;) ?swkey=([^;]*)(;|$)' ) ) {
    	var previous_swkey = unescape( ws.upgradeReq.headers['cookie'].match( '(^|;) ?swkey=([^;]*)(;|$)' )[2] );
    	console.log('previous_swkey:' + previous_swkey);
    	lost(previous_swkey, swkey, ws);
    }
	
	console.log(ws._socket.remoteAddress);
	console.log(ws.upgradeReq.headers);
	console.log(this.clients.length + ' connections');
    
    ws.send(swkey);
    
    if (!sitting(ws)) {
    	var seatpref = [4,7,1,6,2,5,3];
    	for (var x = 0; x < seatpref.length; x++ ) {
    		console.log('check seat-' + seatpref[x]);
    		if ( remote_bj.seats[seatpref[x]].player == null ) {
    			console.log('give seat:' + seatpref[x]);
    			sit(seatpref[x],ws,swkey);
    			break;
    		}
    	}
    }
    
    setTimeout( function() { wss.tablecast(); }, 750);
    
	ws.disconnect = function() {
		for (var x = 0; x < seats_clients.length; x++) {
			if ( seats_clients[x] == ws ) {
				console.info('client disconnect:' + remote_bj.simple() );
				try {
					console.log('need to exit properly');
					//remote_bj.act( { seat: x, action : 'stand'} );
					//stand(x);					
														
				} catch (err) {
					console.log('disconnect but cannot stand:' + err);
				}
			}
		}		 				
	}
    
	ws.on('message', function(message) {
    	console.log('received: %s', message.length == 0 ? '<blank>' : message );    	
    	var play = JSON.parse(message);
    	try {
    		if ( verify(play.seat, ws) ) {
    			remote_bj.act(play);
    			if ( play.action == 'stand' ) {
    				ws.stand(play.seat)
    			}
    			wss.tablecast()
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
		if (remote_bj.seats[msg].hand() && remote_bj.seats[0].activeseat() == msg ) {
			console.log('staying active hand');
			remote_bj.act({action:"stay", seat:msg});
			wss.tablecast(); 
		} else if (remote_bj.seats[msg].player && remote_bj.seats[msg].player.chips < remote_bj.minimum ) {
			console.log('stand dead player');
			remote_bj.act({action:"stand", seat:msg});
		} else if (remote_bj.seats[msg].player) { 
			console.log('no one at:' + msg);
			wss.tablecast();
		}
	} else {
		console.log( remote_bj.simple() );
	}
});

var quicktimer = null
var wait_a_bit = 0;

dealer = function(delay) { 
	//console.log('dealer check as:' + remote_bj.seats[0].activeseat() + ' options:' + remote_bj.seats[0].options() );
	try {
		if ( remote_bj.seats[0].activeseat() == null && remote_bj.seats[0].options().length > 0 && remote_bj.seats[0].options()[0] == 'deal' && !quicktimer ) {
			console.log('SEAT ACT:' + remote_bj.seats[0].options()[0]);
			quicktimer = setTimeout( function() { remote_bj.act({ action: remote_bj.seats[0].options()[0], seat: 0 }); wss.tablecast(); quicktimer = null; },
			2 * delay
			);
		} else if ( remote_bj.seats[0].activeseat() == 0 && !quicktimer ) {
			console.log('HAND ACT:' + remote_bj.seats[0].hand0.options()[0]);
			if ( remote_bj.seats[0].hand0.options()[0] == 'insurance' ) {
				quicktimer = setTimeout( function() { remote_bj.act({ action: remote_bj.seats[0].hand0.options()[0], seat: 0 }); wss.tablecast(); quicktimer = null; }, 
				2 * delay);
			} else {
				quicktimer = setTimeout( function() { remote_bj.act({ action: remote_bj.seats[0].hand0.options()[0], seat: 0 }); wss.tablecast(); quicktimer = null; }, 
				2 * 1000 
				);
			}
		} else {
			console.log(remote_bj.seats[0].options().length + ' options as:' + remote_bj.seats[0].activeseat());
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
keepalive(30000);