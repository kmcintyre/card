var requirejs = require('requirejs'),	
	WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({port: 8080});

requirejs.config({
    nodeRequire: require
});

var player = requirejs('player')
var table = requirejs('table')

var stdin = process.openStdin();

console.log('started');

function verify() {
	return true;
}

var t = new table();
t.addseats(2);

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
	        wss.broadcast( JSON.stringify({ "type": "msg", "txt" : "lost 1 player"}) );
	    });
	
	    ws.on('nickname', function(json) {
	    	console.log('nickname:' + json.nickname);
	    	wss.broadcast( JSON.stringify({ "type": "user", "nickname": json.nickname }), this );
	    });
	    
	    var p = new player(ws);	    	    	    
	    ws.send( JSON.stringify({ "type": "msg" , "txt" : "welcome, player", "from": "server"}) );
    }
});

var addconsole = true;

if ( addconsole ) {

	var consoleclient = function () {
		this.send = function(sm) {
			console.info('send to client:' + sm);
		};   
		
		this.received = function(sm) {
			console.info('received from client:' + sm);
		}		
	};
	
	var cp = new player(new consoleclient(), 5000);	
	
	stdin.on('data', function(message) {
		var msg = message.toString().substring(0, message.length - 1);
		console.log("message:" + msg);
		if ( msg.indexOf('bet') == 0 ) {
			t.bet( parseInt( msg.substring(3, 4) ), parseInt(msg.substring(4)), cp );
		} else if ( msg.indexOf('hit') == 0 ) {
			t.hands(true)[0].hit( t.shoe.next() );			
		} else if ( msg.indexOf('stay') == 0 ) {
			t.hands(true)[0].stay();			
		} else if ( msg.indexOf('double') == 0 ) {
			//t.hands(true)[0].double();					
		} else if ( msg.indexOf('split') == 0 ) {
			t.hands(true)[0].split();					
		} else if ( msg.indexOf('deal') == 0 ) {
			t.deal();			
		} else {
			console.info("table:" + t.toString());
		}
	});	
}

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