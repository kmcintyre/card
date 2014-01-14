define(["card"], function(card) {

	bjValues = {"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"10":10,"J":10,"Q":10,"K":10,"A":1};
	
	card.prototype.bjValue = function() {
		return bjValues[this.card];
	}	
	
	function bjhand(bet, player) {
		this.bet = bet;
		this.cards = new Array();
		this.stayed = false;
		this.player = player;
	}
	
	bjhand.prototype.option = function(opt) {
		for (var x = 0; x < this.options().length; x++) {
			if ( this.options()[x] == opt ) {
				return true;
			}
		}
		return false;
	}
	
	bjhand.prototype.options = function() {
		//console.info('get options:' + this.cards.length);
		var opts = new Array();
		if ( this.stayed ) {
			return opts;
		}		
		if ( this.bet instanceof Array && this.cards.length < 3 ) {
			opts[opts.length] = "autohit";
			return opts;
		}
		if ( this.cards.length < 2 ) {		
			opts[opts.length] = "wait";
			return opts;
		}
		if ( this.cards.length == 2 ) {
			opts[opts.length] = "double";
		}
		if ( this.cards.length == 2 &&  this.cards[0].card == this.cards[1].card) {
			opts[opts.length] = "split";			
		}		
		if ( this.value() < 21) {			
			opts[opts.length] = "hit";			
			opts[opts.length] = "stay";
		}
		return opts;
	}	
	
	bjhand.prototype.insurance = function(bet) {
		this.bet = [this.bet,bet];
	}
	
	bjhand.prototype.double = function(bet) {
		this.bet = [this.bet,bet];
	}

	bjhand.prototype.split = function(bet) {
		console.info('split!' + this.cards.length)
		if ( this.cards.length == 2 ) {
			var nh = new bjhand(bet);
			nh.cards[nh.cards.length] = this.cards.pop();
			console.info('next hand:' + nh.toString());
			return [this, nh];
		}		
	}
	
	bjhand.prototype.hit = function(c) {		
		this.cards[this.cards.length] = c;
		if ( this.bet instanceof Array ) {
			console.info('doubled!!!!');
			this.stay();
		}
	}
	
	bjhand.prototype.stay = function() {
		this.stayed = true;
	}	
	
	bjhand.prototype.hasAce = function() {
		for (var x = 0; x < this.cards.length; x++) {
			if ( this.cards[x].card == 'A' ) {
				return true;
			}
		}
		return false;
	}
	
	bjhand.prototype.value = function() {
		try {
			var v = 0;
			for (var x = 0; x < this.cards.length; x++) {
				v = v + this.cards[x].bjValue();
			}
			if ( this.hasAce() && v <= 11 ) {
				v = v + 10;
			}
			return v;
		} catch (err) {
			console.info("error with bjhand value:" + err);
			return NaN;
		}
	}
	
	bjhand.prototype.toString = function() {
		return "cards:" + this.cards + " value:" + this.value() + " options:" + this.options();
	}
	
    return bjhand;
});