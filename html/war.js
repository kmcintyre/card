warValues = {"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"10":10,"J":11,"Q":12,"K":13,"A":14};

card.prototype.warValue = function() {
  return warValues[this.card];
}

function WarPlayer(cards, shufflewinpile) {
	this.playpile = cards;
	this.warpile = new Array();
	this.winpile = new Array();
	this.shufflewinpile = false;
	this.stats = {}	
	if ( shufflewinpile ) {
		this.shufflewinpile = true;
	}
}

WarPlayer.prototype.details = function() {
	return "playpile" + this.playpile + " warpile:" + this.warpile + " winpile:" + this.winpile; 
}

WarPlayer.prototype.cardCount = function() {
	return this.playpile.length + this.winpile.length;
}

WarPlayer.prototype.gatherwinpile = function(size) {
	var temp = this.winpile.splice(0, this.winpile.length);			
	if ( this.shufflewinpile ) {
		this.playpile = shuffle(temp);
	} else {
		//this.playpile = temp.reverse();
		this.playpile = temp;
	}
}

WarPlayer.prototype.play = function(size) {
	for (var i = size; i > 0; i-- ) {
		if ( this.playpile.length > 0 ) {
			this.warpile.push( this.playpile.pop() );
		} else if ( this.winpile.length > 0 ) {
			this.gatherwinpile();
			this.play(i);
			return;
		}
	}
}

function War() { 
	this.props = null;
	this.players = null;	
}

War.prototype.start = function(props) {
    this.props = props;
    this.stats = { "battles" : 0, "war1" : 0, "war2" : 0, "war3" : 0, "war4" : 0, "war5" : 0, "war6" : 0, "war7" : 0, "war8" : 0, "war9" : 0 };
    d = new deck(); 
    d.cards = shuffle(d.cards);
    this.players = { 
    	"player1": new WarPlayer(d.cards.splice(0,26), props["shufflewinpile"]), 
    	"player2": new WarPlayer(d.cards.splice(0,26), props["shufflewinpile"]) 
    };
}

War.prototype.quit = function() {}

War.prototype.atWar = function() {
	if ( this.players["player1"].warpile.length == 0 || this.players["player2"].warpile.length == 0 ) {
		return false;
	} else {
		p1c = this.players["player1"].warpile[ this.players["player1"].warpile.length - 1 ];
		p2c = this.players["player2"].warpile[ this.players["player2"].warpile.length - 1 ];
		return p1c.warValue() == p2c.warValue();
	}
}

War.prototype.beatsace = function(c1, c2) {
	if ( c2.warValue() == warValues["A"] && this.props["beatsace"].indexOf( c1.warValue() ) > -1  ) {
		return true;
	}
	return false;
}

War.prototype.gatherwin = function(wp, lp) {
	wp1 = this.players[lp].warpile.splice(0, this.players[lp].warpile.length);
	wp2 = this.players[wp].warpile.splice(0, this.players[wp].warpile.length)
	this.players[wp].winpile = this.players[wp].winpile.concat( wp1 );
	this.players[wp].winpile = this.players[wp].winpile.concat( wp2 );
}

War.prototype.gather = function() {
	p1c = this.players["player1"].warpile[ this.players["player1"].warpile.length - 1 ];
	p2c = this.players["player2"].warpile[ this.players["player2"].warpile.length - 1 ];
	if ( this.beatsace(p1c, p2c) ) {
		this.gatherwin("player1", "player2");
	} else if ( this.beatsace(p2c, p1c) ) {
		this.gatherwin("player2", "player1");
	} else if ( p1c.warValue() > p2c.warValue() )  {
		this.gatherwin("player1", "player2");
	} else if ( p1c.warValue() < p2c.warValue() )  {
		this.gatherwin("player2", "player1");
	}
}

War.prototype.war = function() {
	
		if ( !this.atWar() && this.players["player1"].warpile.length > 0 && this.players["player2"].warpile.length > 0 ) {
			this.gather();
		}
		
		if ( this.atWar() ) {
			
			var temp = ( this.players["player1"].warpile.length > this.players["player2"].warpile.length ? this.players["player1"].warpile.length : this.players["player2"].warpile.length);
			var temp2 = this.props["warbury"] + 1;
			var warType = Math.floor(temp / temp2) + temp % temp2;
			
			this.stats["war" + warType]++;			
			
			if ( this.players["player1"].cardCount() == 0 && this.players["player2"].cardCount() == 0 ) {
				this.stats["outcome"] = "Cat's Game!";
				throw this.stats;
			}			   
			
			this.players["player1"].play(this.props["warbury"]);
			this.players["player2"].play(this.props["warbury"]);			
			
		} else if ( this.players["player1"].cardCount() == 0 ) {
			this.stats["outcome"] = "Player 2 Wins!";
			throw this.stats;
		} else if ( this.players["player2"].cardCount() == 0 ) {
			this.stats["outcome"] = "Player 1 Wins!";
			throw this.stats;		
		}

		this.players["player1"].play(1);
		this.players["player2"].play(1);			

}