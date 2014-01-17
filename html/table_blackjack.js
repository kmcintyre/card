define(["table", "shoe", "hand_blackjack_dealer", "hand_blackjack_player"], function(table, shoe, hand_blackjack_dealer, hand_blackjack_player) {
		
	function table_blackjack() {
		table.call(this);
		this.nick = 'blackjack';
		this.shoe = new shoe();
		this.shoe.burn(1);
    	this.minimum = 100;
    	this.splitlimit = 3;
    	this.startingchips = 1000;
    	this.seats[0] = { label : 'Dealer', player : { name: 'Dealer', noOptions: true }, hand: null };
    }
	
	table_blackjack.prototype = new table();
	table_blackjack.prototype.constructor=table_blackjack;	

	table_blackjack.prototype.act = function(step) {
		console.log('blackjack act:' + step.action);
		try {
			if ( step.action == 'hit' ) {
				this.seats[step.seat].hand.hit( this.shoe.next() );
			} else if ( step.action == 'double' ) {
				this.double(step.seat);
			} else if ( step.action == 'stay' ) {
				this.seats[step.seat].hand.stay();
			} else if ( step.action == 'expose' ) {			
				this.seats[step.seat].hand.expose();			
			} else if ( step.action == 'insurance' && step.seat > 0) {
				this.insurance(step.seat);
			} else if ( step.action == 'even' && this.seats[step.seat].hand.bj() ) {
				this.even(step.seat);
			} else if ( step.action == 'insurance' && !this.seats[step.seat].hand.insured ) {	
				console.log('check hole card insurance');
				this.seats[0].hand.insurance();
				if ( this.has('bet') ) {
					for (var x = 1; x < this.seats.length; x++) {
						if ( parseInt(this.seats[x].hand.insurance) > 0 ) {
							console.log('lost insurance bet');
							delete this.seats[x].bet;
						}
					}
				}
			} else if ( step.action == 'backdoor' && step.seat == 0 ) {
				console.log('check hole card backdoor');
				this.seats[step.seat].hand.backdoor();			
			} else if ( step.action == 'deal') {
				this.deal(step.seat);
			} else if ( step.action == 'payout' && step.seat == 0 ) {
				this.payout();
			} else if (step.action == 'split' ) {
				this.split(step.seat);
			} else {
				table.prototype.act.call(this, step);
			}
		} catch (err) {
			console.log('we got a blackjack!' + err);
			for (var x = 1; x < this.seats.length; x++) {
				if ( this.has('hand', x) ) {
					console.log('stay hand');
					this.seats[x].hand.stay();
				} 				
			}
			//this.act({action: 'expose', seat: 0});
		}
	}
	
	table_blackjack.prototype.options = function() {
		table.prototype.options.call(this);
		if ( this.seats[0].hand ) {
			console.log('check dealer');
			if ( this.seats[0].hand && this.seats[0].hand.options().length == 1 && this.seats[0].hand.options()[0] == 'insurance' ) {
				console.log('insurance');
				for (var x = 1; x < this.seats.length; x++) {
					if ( this.has('hand', x) && this.seats[x].hand.bj() && parseInt(this.seats[x].hand.bet) > 0 ) {
						this.seats[x].options = ['even'];
					} else if ( this.has('hand', x) && parseInt(this.seats[x].hand.bet) > 0 ) {
						this.seats[x].options = ['insurance'];
					}
				}			
			} else if ( this.seats[0].hand && this.seats[0].hand.options().length == 1 && this.seats[0].hand.options()[0] == 'backdoor' ) {
				console.log('backdoor');
				for (var x = 1; x < this.seats.length; x++) {
					if ( this.has('hand', x) ) {
						console.info('remove options for backdoor');
						this.seats[x].options = [];
					}
				}			
			} else if ( this.seats[0].hand && this.seats[0].hand.options().length == 1 && this.seats[0].hand.options()[0] == 'expose' ) {
				console.log('ready to expose?');
				for (var x = 1; x < this.seats.length; x++) {
					if ( this.has('hand', x) ) {
						console.log('checking:' + this.seats[x].hand.options().length);
						if ( this.seats[x].options && this.seats[x].hand.options().length > 0  ) {
							console.log('remove expose');
							this.seats[0].options = [];
							for (var y = x + 1; y < this.seats.length; y++) {
								this.seats[y].options = [];
							}
						} else {
							console.log('check for splits');
						}
					}
				}
			} else if ( this.seats[0].hand && this.seats[0].hand.options().length == 1 && this.seats[0].hand.options()[0] == 'hit' ) {
				console.log('hit');
			} 
			
		} else if ( !this.has('hand') && this.has('bet') ) {
			this.seats[0].options[this.seats[0].options.length] = 'deal';
		}
	}
	
	table_blackjack.prototype.deal = function(seat) {
		if ( seat == 0 ) {
			table.prototype.deal.call(this);
			console.log('create dealer hand');
			this.seats[0].hand = new hand_blackjack_dealer();
			if ( this.shoe.played > this.shoe.penetration ) {
				this.shoe.shuffle();
				this.shoe.burn(1);
			}
			for (var y = 1; y <= 2; y++) {
	    		for (var x = 0; x < this.seats.length; x++) {
	    			var bump = ( x == this.seats.length - 1 ? 0 : x + 1);
	    			if ( this.has('hand', bump) ) {
	        			if ( !this.seats[bump].hand.cards ) {
	    					var replacement = new hand_blackjack_player();
	    					if ( this.seats[bump].hand.bet ) {
	    						replacement.bet = this.seats[bump].hand.bet;
	    					}    			
	    					this.seats[bump].hand = replacement;
	        			}
	        			this.seats[bump].hand.deal( this.shoe.next(bump) );
	        			console.log('card ' + y + ' to ' + bump + ' ' + this.seats[bump].hand);
	    			}
	    		}
	    	}
		} else if ( this.seats[seat].hand.options().length == 0) {
			console.info('deeper');
		} else if ( this.seats[seat].hand.options()[0] == 'deal' ) {
			console.info('deal split');
			this.seats[seat].hand.deal(this.shoe.next(seat));
		}
    }	
	
    table_blackjack.prototype.insurance = function(seat) {
    	if ( this.seats[seat].hand.insurance ) {
			console.log('remove insurance');
			this.seats[seat].player.chips += this.seats[seat].hand.insurance;
			delete this.seats[seat].hand.insurance;
		} else {
			console.log('buy insurance');
			this.seats[seat].hand.insurance = this.seats[seat].hand.bet / 2;
			this.seats[seat].player.chips -= this.seats[seat].hand.insurance;
		}
    }
    
    table_blackjack.prototype.split = function(seat) {
    	var splithands = this.seats[seat].hand.split(); 
    	if ( splithands[0].bet ) {
    		splithands[1].bet = splithands[0].bet;
    	}
    	this.seats[seat].hand = splithands[0];
    	this.seats[seat].hand1 = splithands[1];
    }
    
    table_blackjack.prototype.even = function(seat) {
    	console.log('even');
    	this.seats[seat].player.chips += this.seats[seat].hand.bet * 2;
    	this.seats[seat].hand.stay();
    	delete this.seats[seat].hand.bet;    	
    }
    
    table_blackjack.prototype.double = function(seat) {
    	console.log('double down');
    	this.seats[seat].player.chips -= this.seats[seat].hand.bet;
    	this.seats[seat].hand.bet = this.seats[seat].hand.bet * 2;
    	this.seats[seat].hand.double( this.shoe.next() );
    }    
    
    table_blackjack.prototype.payout = function() {
    	console.log('called payout');
    	for (var x = 1; x < this.seats.length; x++) {
    		console.log('check hand:' + x);
    		if ( this.has('hand',x) ) {    		
    			if ( this.seats[x].hand.unexposed ) {
    				console.log('expose card');
    				this.seats[x].hand.expose();
    				return;
    			}
				if ( this.seats[x].hand.winner(this.seats[0].hand)  ) {
					console.log('winner!');
					if ( this.seats[x].hand.bj() ) {
						if ( this.seats[x].hand.bet ) {
							console.log('bj!');
							this.seats[x].player.chips += this.seats[x].hand.bet * 2.5
						}
					} else {						
						console.log('straight winner');
						this.seats[x].player.chips += this.seats[x].hand.bet * 2
					}	    					
				} else if ( this.seats[x].hand.push(this.seats[0].hand) ) {
					if ( this.seats[x].hand.bet ) {
						console.log('push:' + this.seats[x].hand.bet);
						this.seats[x].player.chips += this.seats[x].hand.bet;							
					}
				} else if ( this.seats[x].hand.insurance && this.seats[0].hand.bj() ) {
					console.log('pay insurance');
					this.seats[x].player.chips += this.seats[x].hand.insurance * 2;
				} else {
					console.log('loser');
				}		
				delete this.seats[x].hand;
				return;
    		}
    	}
    	console.log('purge dealer hand');
    	delete this.seats[0].hand;
    }	
    return table_blackjack;
});