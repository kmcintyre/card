define(["deck"], function(deck) {

	function hand(bet) {
		if ( bet != undefined && parseInt(bet) > 0 ) {
			this.bet = parseInt(bet); 
		}
		this.cards = new Array();
		this.folded = false;
		this.ante = 0;
	}
	
	hand.prototype.deal = function(c) {
		this.cards[this.cards.length] = c;
	}
		
	hand.prototype.options = function() {
		if ( this.folded ) {
			return [];
		} else {
			return ['fold'];
		}		
	}
	
	hand.prototype.fold = function() {
		this.folded = true;
	}
	
	hand.prototype.simple = function() {
		return { cards: this.cards, bet: this.bet, options: this.options(), folded: this.folded, ante: this.ante };
	}
	
    return hand;
});