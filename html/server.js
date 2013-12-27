var requirejs = require('requirejs'),	
	WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({port: 8080});

requirejs.config({
    nodeRequire: require
});

var card = requirejs('card')
var player = requirejs('player')
var tourney = requirejs('tourney')

//util.inherits(tourney, events.EventEmitter);
	
var stdin = process.openStdin();

console.log('started');

function verify() {
	return true;
}

var t = new tourney();
//util.inherits(t, events.EventEmitter);

t.on('start', function () {
  console.info('starting');
  this.start();
});

var addconsole = false;
if ( addconsole ) {	
	var consoleclient = function () {
		this.send = function(sm) {
			console.info('send to client:' + sm);
		};   
		
		this.received = function(sm) {
			console.info('received from client:' + sm);
		}		
	};
	var cp = new player(new consoleclient());
}

wss.on('connection', function(ws) {
	
	console.log('connection:' + this.clients.length);
	
	if ( verify(ws) ) {
	
	    ws.on('message', function(message) {
	        console.log('received: %s', message.length == 0 ? '<blank>' : message );
	        var json = JSON.parse(message);
	        if ( json.type ) {
	        	console.log("emit type:" + json.type);
	        	ws.emit(json.type, json);
	        } else {
	        	console.log("no type:" + json);
	        }                
	    });
	    
	    ws.on('bet', function(json) {
	        console.log('received bet:' + json.value);
	        try {
	        	t.findplayer(this).bet(json.value);
	        	t.findtable(this).deal();
	        } catch (err) {
	        	console.info("hmmm:" + err);
	        }
	    });
	    
	    ws.on('close', function() {
	        console.log('close');
	    });
	
	    ws.on('nickname', function(json) {
	    	console.log('nickname:' + json.nickname);
	    	wss.broadcast( JSON.stringify({ "type": "user", "nickname": json.nickname }), this );
	    });
	    
	    //ws.on('requestcard', function(data) {        
	    //	ws.send( JSON.stringify( drawcard() ) );
	    //});
	    console.info('t.isStarted():' + t.isStarted());
	    if ( !t.isStarted() ) {
	    	ws.send( JSON.stringify({ "type": "msg" , "txt" : "welcome, you are player:" + (this.clients.length +  (addconsole ? 1 : 0)) , "from": "server"}) );
	    } else {
	    	ws.send( JSON.stringify({ "type": "msg" , "txt" : "tourney started" , "from": "server"}) );
	    }   
    }
    
});

stdin.on('data', function(message) {
	var msg = message.toString().substring(0, message.length - 1);
	console.log("message:" + msg);
	if ( t.players.length == 0 && t.tables.length == 0 && t.winners == 0 ) {
		console.log("start!");
		wss.start();		
	} else if ( t.players.length > 0  && t.tables.length == 0 ) {
		t.sitplayers();
		console.info('emit tourney start');
		t.emit('start');
	} else if ( addconsole && t.isStarted() && msg.length > 0 ) {
		cp.client.received(msg);
	} else {
		console.log("nothing to do: players-" + t.players.length + " tables-" + t.tables.length);
	}
});

wss.start = function() {
	console.info('start:' + this.clients.length);
	wss.broadcast( JSON.stringify({ "type": "msg" , "txt" : "tourney starting players: " + (this.clients.length +  (addconsole ? 1 : 0)), "from": "server"}) );
	for(var i in this.clients) {
		console.info('create player:' + this.clients[i].constructor.name);
		t.players[t.players.length] = new player(this.clients[i]);
	}
	if ( addconsole ) {
		console.info('create console player')
		t.players[t.players.length] = cp;
	}	
	console.info('created:' + t.players.length);
}

wss.showcard = function() { 
	var i = Math.floor((Math.random()*52));
	console.log('i:' + i);
	var c = new card(i);
	c['type'] = "card";
	wss.broadcast( JSON.stringify( c ) );	
};

wss.broadcast = function(data, ws) {
	console.log('broadcast clients:' + this.clients.length + ' data:' + data );
	for(var i in this.clients) {
		try {
    		this.clients[i].send( data );
	    } catch (err) {
	    	this.clients[i].close();
	    	console.err('error:' + err);
	    }        		
	}    	
};