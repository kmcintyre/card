var WebSocketServer = require('ws').Server,
	cards = require('../card.js'),
	deck = require('../deck.js'), 	
	wss = new WebSocketServer({port: 8080});
	
var stdin = process.openStdin();

console.log('started');

var mycards = deck.shuffle( new deck.deck().cards );

function drawcard() {
	var c = mycards.pop();
	if ( !c ) {
		wss.broadcast("new deck");
		mycards = cards.shuffle( new cards.deck().cards );
		c = mycards.pop();
	}
	return c;
}

function verify() {
	return true;
}

wss.on('connection', function(ws) {
	
	console.log('connection:' + this.clients.length);
	
	if ( verify(ws) ) {
	
	    ws.on('message', function(message) {
	        console.log('received: %s', message.length == 0 ? '<blank>' : message );
	        var json = JSON.parse(message);
	        if ( json.type ) {
	        	console.log("emit type:" + json.type + " with data:" + json.data);
	        	ws.emit(json.type, json);
	        } else {
	        	console.log("no type:" + json);
	        }                
	    });
	    
	    ws.on('close', function() {
	        console.log('close');
	    });
	
	    ws.on('nickname', function(json) {
	    	console.log('nickname:' + json.nickname);
	    	wss.broadcast(JSON.stringify({ "type": "user", "nickname": json.nickname }), this);
	    });
	    
	    ws.on('requestcard', function(data) {        
	    	ws.send( JSON.stringify( drawcard() ) );
	    });
	        
	    ws.send( JSON.stringify({ "type": "msg" , "txt" : "welcome", "from": "server"}) );
    
    }
    
});

stdin.on('data', function(message) { wss.showcard() });

wss.showcard = function() {
	var c = drawcard();
	c['type'] = "card";
	wss.broadcast( JSON.stringify( c ) );	
};

wss.broadcast = function(data, ws) {
	console.log('broadcast clients:' + this.clients.length + ' data:' + data );
	for(var i in this.clients) {
		try {
    		this.clients[i].send( data );
	    } catch (err) {
	    	console.err('error:' + err);
	    }        		
	}    	
};