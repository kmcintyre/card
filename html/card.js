define(function() {

	var cardorder = new Array("A","2","3","4","5","6","7","8","9","10","J","Q","K");
	var suitorder = new Array("S","H","C","D");
	
	function card(c) {
	    this.card = cardorder[ Math.floor( c % 13 ) ];
	    this.suite = suitorder[ Math.floor( c / 13 ) ];    	
    }
    
    card.prototype.toString = function() {
    	try {
    		return this.card.toString() + this.suite.toString();
    	} catch (err) {
    		throw "Unknown Card";
    	}
    }
    
    card.prototype.toImg = function() {
    	var i = new Image();
    	i.src = '/deck/' + this.card + this.suite + '.png';
    	i.className = 'card';
    	return i;
    }
    
    return card;
    
});
