var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , cards = require('../card_deck');

server.listen(9090);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/index.html', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var usernames = {};

var mycards = cards.shuffle( new cards.deck().cards );

io.sockets.on('connection', function (socket) {
	
	console.log('connection:' + socket);
	
	if ( Object.keys(usernames).length ) {
		socket.emit('users', usernames);
	} else {
		console.log('usernames:' + usernames);
	}
	
	socket.on('adduser', function(username){		
		console.log('adduser:' + username);				
		if ( socket.username ) {
			console.log('rename:' + socket.username + 'to:' + username);
			delete usernames[socket.username];
		}		
		socket.username = username;
		usernames[username] = username;		
		io.sockets.emit('users', usernames);		
	});
	
	socket.on('requestcard', function () {
		if ( socket.username ) {
			var card = mycards.pop();
			if ( card ) {
				io.sockets.emit('card', socket.username, card);			
			}
		}
	});
	
	socket.on('disconnect', function(){	
		if ( socket.username ) {
			console.log('disconnect:' + socket.username); 
			delete usernames[socket.username];
			socket.broadcast.emit('users', usernames);
		}
	});
});