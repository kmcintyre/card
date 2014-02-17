define(["deck"], function(deck) {
	
	var shoeDecks = {"single":1,"double":2,"quad":4,"six":6,"oct":8};
	
	function shoe(decks) {
		if ( !isNaN(shoeDecks[decks]) ) {
			this.number_of_decks = shoeDecks[decks];
		} else {
			this.number_of_decks = 6;
		}		
		this.played = 0;
		this.penetration = 0;		
		for (var i = 0; i < this.number_of_decks-1; i++) {
			// we're adding too so 
			this.cards = this.cards.concat( new deck().cards );
		}
		this.penetration = parseInt(this.cards.length * this.number_of_decks / (this.number_of_decks + 1));
		if ( this.penetration == 0 ) {
			this.penetration = 16;
		}
		console.log('total cards:' + this.cards.length);
	}
	
	shoe.prototype = new deck();
	shoe.prototype.constructor=shoe;	
	
	shoe.prototype.burn = function(number_of_cards) {
		if ( isNaN(parseInt(number_of_cards)) ) {
			return this.next();
		} else if ( number_of_cards == 1 ) {
			return this.next();
		} else if ( number_of_cards > 1 ) { 
    		number_of_cards--;
    		return this.next() + this.burn(number_of_cards);
    	}
		
    }	

	shoe.prototype.penetrated = function() {		
		return this.cards.length - this.played < this.penetration;
	}
	
	shoe.prototype.toString = function() {
		return "played:" + this.played + " penetrated:" + this.penetrated(); // + " cards length:" + this.cards.length;
	}
	
	shoe.prototype.next = function() {
		console.log('shoe');
		return this.cards[this.played++];
	}
	
	return shoe;
	
});