define(["card"], function(card) {

	bjValues = {"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"10":10,"J":10,"Q":10,"K":10,"A":1};
	
	card.prototype.bjValue = function() {
		return bjValues[this.card];
	}	
	
	function hand_blackjack() {
		this.cards = new Array();
		this.stayed = false;
		this.soft = false;
	}
	
	hand_blackjack.prototype.split = function() {
		if ( this.cards.length == 2 ) {
			var nh = new hand_blackjack();
			nh.cards[nh.cards.length] = this.cards.pop();
			console.log('split hand:' + nh.toString());
			return [this, nh];
		}		
	}	

	hand_blackjack.prototype.card = function(c) {		
		this.cards[this.cards.length] = c;
	}
	
	hand_blackjack.prototype.bust = function() {
		return this.value() > 21;
	}
	
	hand_blackjack.prototype.stay = function() {
		this.stayed = true;
	}	
	
	hand_blackjack.prototype.toString = function() {
		return this.cards.toString() + " bj value:" + this.value() + " options:" + this.options();
	}
	
	hand_blackjack.prototype.option = function(opt) {
		for (var x = 0; x < this.options().length; x++) {
			if ( this.options()[x] == opt ) {
				return true;
			}
		}
		return false;
	}
	
	hand_blackjack.prototype.options = function() {
		//console.log('get options:' + this.cards.length);
		var opts = new Array();
		if ( this.stayed || this.bust() || this.cards.length < 2 ) { 
			return opts;
		} else if ( this.cards.length < 2 ) {		
			opts[opts.length] = 'deal';
			return opts;
		}		
		if ( this.cards.length == 2 ) {
			opts[opts.length] = 'double';
		}
		if ( this.cards.length == 2 && this.cards[0].card == this.cards[1].card) {
			opts[opts.length] = 'split';			
		}
		
		if ( this.value() < 21) {			
			opts[opts.length] = 'hit';						
		}
		opts[opts.length] = 'stay';
		return opts;
	}	
			
	hand_blackjack.prototype.bj = function() {
		return this.value() == 21 && this.cards.length == 2;
	}
	
	hand_blackjack.prototype.hasAce = function() {
		for (var x = 0; x < this.cards.length; x++) {
			if ( this.cards[x].card == 'A' ) {
				return true;
			}
		}
		return false;
	}
	
	hand_blackjack.prototype.value = function() {
		var v = 0;
		this.soft = false;
		try {			
			for (var x = 0; x < this.cards.length; x++) {
				if ( this.cards[x].bjValue() ) {
					v = v + this.cards[x].bjValue();
				} else { 
					//console.log('not counting:' + this.cards[x]);
				}
			}
			if ( this.hasAce() && v <= 11 ) { v = v + 10; }
			return v;
		} catch (err) {
			console.warn("error with hand_blackjack value:" + err);
			return v;
		}
	}
	
	hand_blackjack.prototype.winner = function(h) {
		if ( this.bust() ) {
			return false;
		} else if ( !this.bust() && h.bust() ) {
			return true;
		} else if ( this.bj() && !h.bj() ) {
			return true;						
		} else if ( this.value() > h.value() ) {
			return true;						
		}
		console.log('failed to win');
		return false;
    }
	
	hand_blackjack.prototype.push = function(h) {
		if ( !this.bust() && !h.bust() && ( (this.bj() && h.bj()) || (this.value() == h.value() && !this.bj() && !h.bj()) )  ) {
			return true;			
		}
		return false;
    }
	
    return hand_blackjack;
});