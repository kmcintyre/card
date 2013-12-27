define(["deck", "card"], function(deck, card) {
	
	function shoe(number_of_decks) {
		this.cards = new Array();
		var nod = 8;
		if ( parseInt(number_of_decks) ) {
			nod = number_of_decks; 
		}
		for (var i = 0; i < nod; i++) {
			console.info('add shuffled cards to shoe');
			this.cards = this.cards.concat( new deck(true) )
		}
	}

	shoe.prototype.toString = function() {
		return 'cards remaining:' + this.cards.length;
	}	
	
	shoe.prototype.next = function() {
		return this.cards.splice(0,1);
	}
	
	return shoe;
	
});