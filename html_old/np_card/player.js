function Player(name) {
	if ( name == null ) {
		throw "Player Has No Name";
	}
	this.name = name;
	this.games = new Array();
}

Player.prototype.challenge = function(game) {
	alert("not implemented");
}

Player.prototype.playgame = function(game) { 
	this.games.push(game);
}

Player.prototype.toString = function() { 
	return this.name;
}