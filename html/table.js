define(["shoe", "dealer", "hand"], function(shoe, dealer, hand) {
	
    function table() {
    	this.seats = new Array(7);    	    	
    	this.discard = new Array();
    	this.minimum = 100;
    };
    
    table.prototype = Object.create(shoe.prototype);
    
    table.prototype.burn = function(number_of_cards) {
    	for ( x = 0; x < number_of_cards; x++) {
    		this.discard[this.discard.length] = this.shoe.next();
    	}    	
    }
    
    table.prototype.play = function() {
    	if ( this.hands.length == 0 || (this.hands.length < 8 && this.hands[this.hands.length - 1].isdone )) {
    		console.info('new hand');
    		var h = new hand(this);
    		this.hands[this.hands.length] = h;
    	} 
    }    
    
    table.prototype.solicitbet = function() {
    	console.info('solicit bet');
    	for (x = 0; x < this.players.length; x++) {
    		try {
    			var p = this.table.players[x];
    			var v = JSON.stringify({"type": "bet", "min" : Math.min(this.minimum,p.chips), "max" : p.chips });
    			console.error("bet message:" + v);
    			p.client.send(v);
    		} catch (err) {
    			console.error("solicitbet error:" + err);
    		}
    	}
    }
    
    table.prototype.deal = function() {
    	console.info('deal!');
		for (x = 0; x = 2; x++) {			
    		for (y = 0; y < this.seats.length; y++) {
    			var c = this.s.next();
    			console.info('card:' + c);
    		}
    	}
	}

    table.prototype.toString = function() {    	
    	return 'seats:' + this.seats.length + ' shoe:' + this.next() + ' discard:' + this.discard.length; 
    }
    
    return table;
});