define(["card", "hand"], function(card, hand) {
	
	function hand_blackjack(bet) {
		hand.call(this, bet);
		this.stayed = false;
		this.unexposed = null;
		this.isBj = false;
	}	
	hand_blackjack.prototype = new hand();
	hand_blackjack.prototype.constructor=hand_blackjack;
	
	hand_blackjack.prototype.simple = function() {
		var j = hand.prototype.simple.call(this);
		j['stayed'] = this.stayed;
		j['unexposed'] = (this.unexposed == null?false:true);
		j['isBj'] = (this.isBj == null?this.bj() : this.isBj);
		return j;
	}
	

	hand_blackjack.prototype.hit = function(c) {
		this.cards[this.cards.length] = c;
	}
	
	hand_blackjack.prototype.expose = function() { 
		this.cards[this.cards.length - 1] = this.unexposed;
		this.unexposed = null;
	}	

	hand_blackjack.prototype.stay = function() {
		this.stayed = true;
	}
	
	hand_blackjack.prototype.bust = function() {
		return this.value() > 21;
	}
	
	hand_blackjack.prototype.toString = function() {
		return this.cards.toString() + " bj value:" + this.value() + " options:" + this.options();
	}
	
	hand_blackjack.prototype.options = function() {		
		var opts = new Array();
		if ( this.stayed || this.bust() || ( this.value() == 21 && this.cards.length > 2 ) ) { 
			return opts;
		} else if ( this.cards.length < 2 ) {		
			opts[opts.length] = 'deal';
			return opts;
		}		
		if ( this.cards.length == 2 ) {
			opts[opts.length] = 'double';
		}
		if ( this.cards.length == 2 && this.cards[0].bjValue() == this.cards[1].bjValue()) {
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
			if ( this.hasAce() && v <= 11 ) {
				this.soft = true;
				v = v + 10; 
			} 
			return v;
		} catch (err) {
			//console.warn("error with hand_blackjack value:" + err);
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