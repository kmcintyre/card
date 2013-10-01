define(function() {

	var cardorder = new Array("2","3","4","5","6","7","8","9","10","J","Q","K","A");
	var suitorder = new Array("S","H","C","D");

    function card(c) {
		this.suite = suitorder[ Math.floor( c / 13 ) ];
		this.card = cardorder[ Math.floor( c % 13 ) ]; 
    };
    
    card.prototype.toString = function() {
  		return '' + this.card + this.suite;
    }
    
    return card;    
});
