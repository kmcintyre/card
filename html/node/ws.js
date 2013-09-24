var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 8080});

console.log('started');

wss.on('connection', function(ws) {
	console.log('connection');
    ws.on('message', function(message) {
        console.log('received: %s', message);
        wss.broadcast(message);
    });
    ws.send('something');
});

wss.broadcast = function(data) {
    for(var i in this.clients)
        this.clients[i].send(data);
};
