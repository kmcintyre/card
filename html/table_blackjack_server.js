var requirejs = require('requirejs'),	
	WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({port: 8080});

requirejs.config({
    nodeRequire: require
});

var table_blackjack = requirejs('table_blackjack')

var stdin = process.openStdin();

var t = new table_blackjack(8);

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
	        	console.log("hmmm:" + err);
	        }
	    });
	    
	    ws.on('close', function() {
	        console.log('close');
	        wss.broadcast( JSON.stringify({ "type": "msg", "txt" : "lost 1 player"}) );
	    });
	
	    //ws.on('nick', function(json) {
	    //	console.log('nick:' + json.nick);
	    //	wss.broadcast( JSON.stringify({ "type": "user", "nick": json.nick }), this );
	    //});
	    
	    var p = new player(ws);	    	    	    
	    ws.send( JSON.stringify({ "type": "msg" , "txt" : "welcome, player", "from": "server"}) );
    }
});


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