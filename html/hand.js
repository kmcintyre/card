define(["card"], function(card) {

	function hand() {
		this.cards = new Array();
		this.folded = false;
	}
	
	hand.prototype.deal = function(c) {
		if ( newcard instanceof Array ) {
			
		} else if ( newcard instanceof card ) {
			this.cards[this.cards.length] = newcard;
		}
	}
	
	hand.prototype.options = function() {
		return [];
	}
	
	hand.fold = function() {
		this.folded = true;
	}
	
    return hand;
});