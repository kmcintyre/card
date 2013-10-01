define(["card"], function(card) {
	function deck() {
		this.cards = new Array();
		for (var i = 0; i < 52;i++ ) {
   			this.cards[i] = new card(i);
  		}		
	}
	
	deck.prototype.toString = function() {
		return '' + this.cards;
	}
	
	return deck;
});
