define(["hand_blackjack", "deck"], function(hand_blackjack, deck) {
	
	function hand_blackjack_player(bet) {
		console.log('new hand_blackjack_player');
		hand_blackjack.call(this, bet);
		this.isSplit = false;
		this.doubled = null;
		this.insured = null;
	}
	
	hand_blackjack_player.prototype = new hand_blackjack();
	hand_blackjack_player.prototype.constructor=hand_blackjack_player;
	
	hand_blackjack_player.prototype.simple = function() {
		var h = hand_blackjack.prototype.simple.call(this);
		h['doubled'] = this.doubled;
		h['isSplit'] = this.isSplit;
		h['insured'] = this.insured;		
		return h;
	}
	
	hand_blackjack_player.prototype.deal = function(c) {
		hand_blackjack.prototype.deal.call(this, c);
		if ( this.isSplit && (this.cards[0].card == 'A' && c.card != 'A')) {
			this.stay();
		} else if (this.cards.length == 2) {
			this.isBj = this.bj();
		}
	}
	
	hand_blackjack_player.prototype.double = function(c, down) {
		if ( down ) {
			this.unexposed = c;
			this.isBj = false;
			this.cards[this.cards.length] = new deck().facedown();
			this.stay();
		} else {
			this.isBj = false;
			this.deal(c);
			this.stay();
		}
	}
	
	hand_blackjack_player.prototype.bj = function() {
		return hand_blackjack.prototype.bj.call(this) && !this.doubled && !this.isSplit;
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
		this.isSplit = true;
		nh.isSplit = true;
		return nh;		
	}
	
	return hand_blackjack_player;
	
});