define(["table", "shoe", "hand_blackjack_player", "hand_blackjack_dealer", "deck"], function(table, shoe, hand_blackjack_player, hand_blackjack_dealer, deck) {
	
	function table_blackjack() {
		console.log('new table blackjack');
		this.shoe = new shoe();
    	this.shoe.burn(1);
    	this.minimum = 100;
    	this.seats[0] = { player : { name: 'Dealer' }, hand: null };
    }
	
	table_blackjack.prototype = new table();
	table_blackjack.prototype.constructor=table_blackjack;
	
    table_blackjack.prototype.toString = function() {    	
    	return 'seats:' + this.seats + ' shoe:' + this.shoe.toString() + ' min bet:' + this.minimum;
    }
    
    table_blackjack.prototype.options = function(x) {
    	//console.info('blackjack checking:' + x);
    	var opts = table.prototype.options.call(this, x);
    	if ( x == 0 ) {
    		opts.shift();    		    		
    	}
    	return opts;
	}
    
    table_blackjack.prototype.dealer = function() {
    	return this.seats[0].hand;
    }    
    
    table_blackjack.prototype.stay = function(seat) {
    	if ( this.seats[seat].hand.option('stay') && seat == this.active() ) {
    		this.seats[seat].hand.stay();
    	}
    }
    
    table_blackjack.prototype.expose = function(seat) {
    	if ( this.seats[seat].hand.option('expose') && seat == this.active() ) {
    		this.seats[seat].hand.expose();
    	}
    }
    
    table_blackjack.prototype.split = function(seat) {
    	if ( this.seats[seat].hand.option('split') && seat == this.active() ) {    		
    		var splits = this.seats[seat].hand.split();
    		console.log('splits:' + splits);
    		this.seats[seat].hand = splits;
    	}
    }
    
    table_blackjack.prototype.hit = function(seat) {
    	if ( this.seats[seat].hand.option('hit') && seat == this.active()  ) {
    		this.seats[seat].hand.card( this.shoe.next() );
    	} 
    }
    
    table_blackjack.prototype.double = function(seat) {
    	if ( this.seats[seat].hand.option('double') && seat == this.active() ) {    		
    		this.seats[seat].player.chips = this.seats[seat].player.chips - this.seats[seat].hand.bet;
    		this.seats[seat].hand.bet = [this.seats[seat].hand.bet, this.seats[seat].hand.bet];
    		this.seats[seat].hand.card( new deck().facedown() );
    		this.seats[seat].hand.double = this.shoe.next();
    		this.seats[seat].hand.stay();
    	}
    }
    
    table_blackjack.prototype.active = function() {
    	for (var x = 0; x < this.seats.length; x++) {
    		if ( this.seats[x].hand != null && this.seats[x].hand.options().length > 0 ) {
    			if ( this.dealer() != null && ( this.dealer().option('backdoor') || this.dealer().option('insurance') ) ) {    				
    				console.log('dealer active for insurance or backdoor');
    				return this.seats.length - 1;
    			} else {
    				return x;
    			}
    		}
    	}
    }    

    table_blackjack.prototype.payout = function() {
    	console.log('payout called dealer options:' + this.dealer().options() );
    	if ( this.dealer().options().length == 1 ) {
    		for (var x = 0; x < this.seats.length - 1; x++) {
    			if ( this.seats[x].hand ) {
    				if ( this.seats[x].hand.double ) {
    			    	console.log('expose:' + x);    					
    					this.seats[x].hand.expose();
    					console.log('exposed:' + this.seats[x].hand);    					
    				} else {
    					console.log('payout seat:' + this.seats[x].hand.cards.toString() + ' dealer:' + this.dealer().cards.toString());
    					var b = this.seats[x].hand.sum();
    					console.log('hand sum:' + b);
	    				if ( this.seats[x].hand.winner(this.dealer())  ) {
	    					console.log('winner!');
	    					if ( this.seats[x].hand.bj() ) {
	    						console.log('bj!');	    					
	    						this.dispense(x, b * 1.5 );
	    					} else {
	    						console.log('straight winner');
	    						this.dispense(x, b );
	    					}	    					
	    					this.dispense(x, b );
	    				} else if ( this.seats[x].hand.push(this.dealer() ) ) {
	    					console.log('push');
	    					this.seats[x].bet = b;
	    				} else {
	    					console.log('loser');
	    					this.seats[x].bet = b;
	    					this.collect(x);	    					
	    				}
	    				this.seats[x].hand = null;
	    				console.log('seat:' + this.seats[x]);
    				}
    				return x;
    			}
    		}
    	}
    	this.seats[this.seats.length - 1].hand = null;
    	console.log('done with hand');
    }
    
    table_blackjack.prototype.option = function(seat, opt) {
    	//console.log('seat:' + seat + ' opt:' + opt);
    	if ( opt == 'payout' && this.dealer() && this.dealer().options().length == 0 && seat == this.seats.length - 1 ) {
    		return true;
    	}
    	if ( this.dealer() && this.dealer().option('backdoor') && seat < this.seats.length - 1  ) {
    		return false;
    	}
    	if ( this.dealer() && this.dealer().option('insurance') ) {
    		
    		if ( opt == 'even' && this.seats[seat].hand.bj() ) {
    			return true ;
    		} else if ( opt == 'insurance' ) {
    			return true;
    		} else {
    			return false;
    		}
    	} 
    	
    	if ( opt == 'expose' && seat == this.seats.length - 1 ) {
    		if ( seat == this.active() && ( this.dealer().option('backdoor') || this.dealer().option('insurance') ) ) {
    			return false;
    		} else if (seat != this.active()) {
    			return false;
    		}
    	} 
    	
    	if ( opt == 'insurance' && this.seats[seat].hand.option(opt) && !this.dealer().option('insurance') ) {
    		return false;
    	}
    	
    	return this.seats[seat].hand.option(opt);    
    }
    
    table_blackjack.prototype.insurance = function(seat) {
    	if ( this.dealer().option('insurance') ) {
    		if ( seat == this.seats.length - 1 ) {
        		console.log('insurance close');
        		try {
        			this.dealer().insurance();
        			for (var x = 0; x < this.seats.length; x++) {
        				if ( this.seats[x].hand && this.seats[x].bet ) {
        					console.log('insurance never pays:' + x + ' ' + this.seats[x].bet);
        					this.collect(x);
        				}        				
        			}
        		} catch (err) {
        			console.warn('blackjack I think');
        			for (var x = 0; x < this.seats.length; x++) {
        				if ( this.seats[x].bet ) {
        					console.log('pay insurance?');
        					this.dispense(x, this.seats[x].bet * 2 );
        				} 
        				this.stay(x);
        			}       			
        			throw "Blackjack!"
        		}    			
    		} else {
    			if ( this.seats[seat].bet ) {
    				console.log('insurance bet exists remove');
    				this.seats[seat].player.chips = this.seats[seat].player.chips + this.seats[seat].bet;
    				this.seats[seat].bet = null;
    			} else {
    				console.log('no insurance bet');
    	    		try {
    	    			this.seats[seat].bet = this.seats[seat].hand.bet;
    	    			this.seats[seat].player.chips = this.seats[seat].player.chips - this.seats[seat].bet;
    	    		} catch (err) {
    	    			console.warn('insurance error:' + err);
    	    		}    				    				
    			}
    		}
    	} else {
    		console.log('should not be called:' + seat);
    	}
    }    
    
    table_blackjack.prototype.backdoor = function(seat) {
    	console.log('backdoor');
    	if ( seat == this.seats.length - 1 ) {
    		try {
    			this.dealer().backdoor();    			
    		} catch (err) {
    			console.log('staying for everyone');
    			for (var x = 0; x < this.seats.length; x++) {
    				this.stay(x);
    			}
    			this.dealer().expose();
    		}
    	}
    }
    
    table_blackjack.prototype.deal = function() {

    }
    
    table_blackjack.prototype.createhands = function() {
    	console.warn('create dealer hand');    	
    	this.seats[0].hand = new hand_blackjack_dealer();    	    	
    	for (var x = 1; x < this.seats.length; x++) {    		    		
    		if ( this.seats[x].player && this.seats[x].bet && !this.seats[x].hand ) {
    				console.log('create hand:' + this.seats[x].bet);
    				this.seats[x].hand = new hand_blackjack_player();
    				this.seats[x].hand.bet[this.seats[x].hand.bet.length] = this.seats[x].bet;
    				this.seats[x].bet = null;
    		}    			    		    		    		
    	}    	
    }
    
    return table_blackjack;
});