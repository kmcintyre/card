define(["util", "shoe", "card"], function(util, shoe, card) {
	
	function blackjack() {
		this.props = null;
		this.players = Array(8);
		this.players[7] = dealer();
	}
	
	return blackjack;
	
});