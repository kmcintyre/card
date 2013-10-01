define(["card", "util"], function(card, util) {
	function deck(shuf) {
		this.cards = new Array();
		for (var i = 0; i < 52;i++ ) {
   			this.cards[i] = new card(i);
  		}
  		if ( shuf ) {
  			this.cards = util.shuffle(this.cards);
  			console.log('shuffled deck:' + this);
  		} else {
  			console.log('straight deck:' + this);
  		}
	};

	deck.prototype.toString = function() {
		return '' + this.cards;
	}
	
	return deck;
});
