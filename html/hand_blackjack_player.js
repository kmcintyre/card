define(["hand_blackjack", "deck"], function(hand_blackjack, deck) {
	
	function hand_blackjack_player() {
		hand_blackjack.call(this);
		this.bet = new Array();
		this.unexposed = null;
		this.double = null;
	}
	hand_blackjack_player.prototype = new hand_blackjack();
	hand_blackjack_player.prototype.constructor=hand_blackjack_player;
	
	hand_blackjack_player.prototype.sum = function() {
		var sumbets = 0;
		for (var x = 0; x < this.bet.length; x++) {
			sumbets = sumbets + parseInt(this.bet[x]);
		}
		return sumbets;
	}
	
	hand_blackjack_player.prototype.expose = function() {
		if ( this.double != null && this.cards.length == 3 ) {
			this.cards[2] = this.double;
			this.double = null;
		}
	}
	
	hand_blackjack_player.prototype.toString = function() {
		return hand_blackjack.prototype.toString.call(this) + ' ' + ( this.bet ? 'bet:' + this.bet : 'no bet' );
	}
	
	return hand_blackjack_player;
	
});