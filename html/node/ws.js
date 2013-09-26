var WebSocketServer = require('ws').Server,
	cards = require('../card_deck'), 
	wss = new WebSocketServer({port: 8080});

console.log('started');

wss.on('connection', function(ws) {
	
	console.log('connection');
    
    ws.on('message', function(message) {
        console.log('received: %s', message);
        wss.broadcast(message);
    });
    
    ws.on('close', function() {
        console.log('close');
		wss.broadcast('disconnect');
    });
            
});

wss.broadcast = function(data, ws) {	
	for(var i in this.clients) {
		try {
			console.log('broadcast client:' + this.clients[i]);
    		this.clients[i].send(data);
	    } catch (err) {
	    	console.err('error:' + err);
	    }        		
	}    	
};