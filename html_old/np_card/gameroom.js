function Gameroom(name) {
	if ( name == null ) {
		throw "Gameroom Has No Name";
	}
	this.name = name;
	this.players = {};
	this.games = {};
}

Gameroom.prototype.toString = function() { 
	return 'Gameroom name: ' + 
		this.name + 
		' players: ' +
		( Object.keys(this.players).length == 0 ?  'empty' : Object.keys(this.players)) + 
		 ' games: ' +
		( Object.keys(this.games).length == 0 ?  'empty' : Object.keys(this.games));
}

Gameroom.prototype.enter = function(player) {
	if ( player in this.players ) {
		throw player.toString() + ' is here';
	}
	this.players[player.toString()] = player;
	document.dispatchEvent(new CustomEvent('newplayer'));
}

Gameroom.prototype.game = function(game) {
	if ( game in this.games ) {
		throw game.toString() + ' exists';
	}	
	this.games[game.toString()] = game;	
}
