define(["deck"], function(deck) {
	
	function shoe(number_of_decks) {
		this.played = 0;
		this.penetration = 0;
		for (var i = 0; i < ( parseInt(number_of_decks) ? parseInt(number_of_decks) - 1 : 5 ); i++) {			
			this.cards = this.cards.concat( new deck().cards );
		}
		this.shuffle();
	}
	
	shoe.prototype = new deck();
	shoe.prototype.constructor=shoe;	
	
	shoe.prototype.burn = function(number_of_cards) {
		if ( number_of_cards == 1 ) {
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