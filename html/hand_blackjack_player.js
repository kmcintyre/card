define(["hand_blackjack", "deck"], function(hand_blackjack, deck) {
	
	function hand_blackjack_player() {
		console.log('new hand_blackjack_player');
		hand_blackjack.call(this);
		this.unexposed = null;
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

	hand_blackjack_player.prototype.double = function(c) {
		this.unexposed = c;
		this.cards[this.cards.length] = new deck().facedown();
		this.stay();
	}

	
	hand_blackjack_player.prototype.expose = function() {
		this.cards[this.cards.length - 1] = this.unexposed;
		this.unexposed = null;
	}
	
	hand_blackjack_player.prototype.toString = function() {
		return hand_blackjack.prototype.toString.call(this) + ' ' + ( this.bet ? 'bet:' + this.bet : 'no bet' );
	}
	
	hand_blackjack.prototype.split = function() {
		var nh = new hand_blackjack_player();
		nh.deal(this.cards.pop());
		console.log('split hand:' + nh.toString());
		return [this, nh];		
	}
	
	return hand_blackjack_player;
	
});