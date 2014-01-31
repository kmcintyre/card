define(["hand_blackjack", "deck"], function(hand_blackjack, deck) {

	function hand_blackjack_dealer() {
		console.log('new hand_blackjack_dealer');
		hand_blackjack.call(this);
		this.checked = false;
		this.insured = false;		
		console.log('does this.cards exist?' + (this.cards instanceof Array))
	}
	
	hand_blackjack_dealer.prototype = new hand_blackjack();
	hand_blackjack_dealer.prototype.constructor=hand_blackjack_dealer;	
	
	hand_blackjack_dealer.prototype.deal = function(c) {
		console.log('dealer received:' + c);
		if ( this.cards.length == 0 ) {
			this.cards[0] = new deck().facedown();
			this.unexposed = c;
		} else if ( this.cards.length == 1 ) {
			this.cards[1] = new deck().facedown();
			this.cards[0] = this.unexposed;
			this.unexposed = c;
		} else {
			this.cards[this.cards.length] = c;
		}
	}
	
	hand_blackjack_dealer.prototype.backdoor = function() {
		this.checked = true;		
		if ( this.unexposed.card == 'A' ) {
			this.isBj = true;
			throw "Backdoor Blackjack";
		} 		
		console.log('not a blackjack');
	}
	
	hand_blackjack_dealer.prototype.sum = function() { return 0; }
	
	hand_blackjack_dealer.prototype.insurance = function() {
		this.insured = true;		
		if ( this.unexposed.bjValue() == 10 ) {
			this.isBj = true;
			throw "Blackjack";
		} 
	}
	
	hand_blackjack_dealer.prototype.options = function() {
		var opts = [];
		if ( this.cards.length < 1 ) {		
			opts[opts.length] = "wait";
			return opts;		
		} else if (
				!this.insured
				&& ( ( this.cards.length == 1 && this.unexposed.card == 'A' ) || ( this.cards.length == 2 && this.cards[0].card == 'A' ) ) 
				) {
			opts[opts.length] = "insurance";
		} else if (
				!this.checked
				&& ( ( this.cards.length == 1 && this.unexposed.bjValue() == 10 ) || ( this.cards.length == 2 && this.cards[0].bjValue() == 10 ) ) 
				) {
			opts[opts.length] = "backdoor";
		} else if (this.unexposed != null) {
			opts[opts.length] = "expose";
		} else if ( this.unexposed == null && (this.value() < 17 || (this.value() == 17 && this.soft ))) {
			opts[opts.length] = "hit";
		} else if ( opts.length == 0 ) {
			opts[opts.length] = "payout";
		}
		//console.log('dealer options:' + opts);
		return opts; 
	}    	

	return hand_blackjack_dealer;

});
