define(["deck", "card", "cardutil"], function(deck, card, cardutil) {
	
	function shoe(number_of_decks) {
		this.cards = new Array();
		this.played = 0;
		for (var i = 0; i < ( parseInt(number_of_decks) ? number_of_decks : 6 ); i++) {			
			this.cards = this.cards.concat( new deck(true).cards );
		}
		this.cards = cardutil.shuffle(this.cards);
	}

	shoe.prototype.toString = function() {
		return 'cards:' + this.cards.length + " played:" + this.played;
	}	
	
	shoe.prototype.next = function() {		
		return this.cards[this.played++];
	}
	
	return shoe;
	
});