define(function() {
	return {
		"shuffle" : function shuffle(cards) {
			shuffledcards = new Array();
 			for (var i = cards.length; i > 0; i--) {
  				var rand_no = Math.random();
  				rand_no = rand_no * i; 
  				rand_no = Math.floor(rand_no);
  				shuffledcards[i - 1] = cards[rand_no]; 
  				cards = cards.slice(0,rand_no).concat( cards.slice(1+rand_no) );
 			}
 			return shuffledcards;
		}		 
	}
});