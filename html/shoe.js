define(["deck", "card", "util"], function(deck, card, util) {
	
	function shoe(number_of_decks) {
		this.cards = new Array();
		
		for (var i = number_of_decks; i < number_of_decks; i++) {
			this.cards = this.cards.concat( new deck(true) )
		}
	}

	shoe.prototype.toString = function() {
		return '' + this.cards;
	}	
	
	return shoe;
	
});