define(["table", "shoe", "hand_blackjack_dealer", "hand_blackjack_player"], function(table, shoe, hand_blackjack_dealer, hand_blackjack_player) {
	
	function dealer(seats, shoe) {
		
		seats[0].activeseat = function(inactive) {
				if ( seats[0].hand0 ) {
					if ( seats[0].hand0.options().length == 1 && ( seats[0].hand0.options()[0] == 'insurance' || seats[0].hand0.options()[0] == 'backdoor') ) {						
						return 0;
					}
				}
        		for (var x = 0; x < seats.length; x++) {
        			var bump = ( x == seats.length - 1 ? 0 : x + 1);
        			if ( seats[bump].hand(inactive) ) {
        				return bump;
        			}
        		}
        		return null;
		};

    	seats[0].activebet = function() {
			for (var x = 0; x < seats.length; x++) {
				if ( seats[x].bet || typeof seats[x].bet === 'number'  ) {
					return x;
				}
			}
			return null;
		};     		
    		
    		
		seats[0].spinset = 20;
		
    	seats[0].options = function() {    		
    		if ( this.activeseat(true) == null && this.activebet() != null ) {
    			return ['deal'];
    			
    		} else if ( this.activeseat(true) == null && this.activebet() == null ) {    			
    			//return ['new dealar'];    			
    			return [];
    		} else {
    			return [];    			
    		}
    	};
    	
    	seats[0].history = function(seat) {
    		console.log('history:' + seat);
			delete seats[seat].hand0;		
			for (var y = 1;; y++) {
				console.log('check split:' + y);
				if ( seats[seat]['hand' + y] ) {
					console.info('move:' + y + ' to '+ (y-1) );
					seats[seat]['hand' + (y-1)] = seats[seat]['hand' + y];						
					seats[seat]['hand' + y] = null;
				} else {
					break;
				}
				delete seats[seat]['hand' + y];
			}
    	}
    	
    	return seats[0];		
	}
	
	function table_blackjack(seats) {
		table.call(this);
		this.shoe = new shoe();
		this.minimum = 25;
    	this.maximum = 750;    
    	
    	this.splitlimit = 3;
    	this.blackjackpays = '3 to 2';
    	this.insurancepays = '2 to 1';
    	this.holecards = 2;
    	this.soft17 = 'hit';
    	this.surrender = true;    	
    	//this.forless = new Array('split','double','insurance');
    	//this.fornothing = new Array('split','double');
    	//this.doubleon = new Array(9,10,11);
    	this.forless = ['double'];
    	this.fornothing = [];
    	this.doubleon = [];
    	
    	this.downdirty = true;    	 
    	
    	for (var x=0;x<(seats>1?seats:1);x++) {
    		this.addseat();
    	}
    	this.seats[0].chair = 'Dealer';
    	this.sit(0, { name: 'manny'});
    	delete this.seats[0].player.chips;
    	this.seats[0] = new dealer(this.seats, this.shoe); 
    	
    	this.decks = this.shoe.number_of_decks;
    	this.maxseats = 8;    	
    }
	
	table_blackjack.prototype = new table();
	table_blackjack.prototype.constructor=table_blackjack;
	
	table_blackjack.prototype.simple = function() {
		var j = table.prototype.simple.call(this);
		j['maximum'] = this.maximum;
		j['splitlimit'] = this.splitlimit;
		j['forless'] = this.forless;
		j['fornothing'] = this.fornothing;
		j['doubleon'] = this.doubleon;
		j['downdirty'] = this.downdirty;
		j['blackjackpays'] = this.blackjackpays;
		j['insurancepays'] = this.insurancepays;
		j['holecards'] = this.holecards;
		j['soft17'] = this.soft17;
		j['surrender'] = this.surrender;
		j['decks'] = this.decks;
    	return j;
	}
	
	table_blackjack.prototype.options = function() {
		var opts = table.prototype.options.call(this);
    	return opts;
    }
	
	table_blackjack.prototype.createhand = function(bet) {
		return new hand_blackjack_player(bet);
    }
	
	table_blackjack.prototype.act = function(step) {
		console.info(step);
		try {
			if ( step.action == 'hit' && this.seats[0].activeseat() == step.seat ) {
				this.hand(step.seat).hit( this.shoe.next() );					
			} else if ( step.action == 'double' && this.seats[0].activeseat() == step.seat ) {
				this.double(step.seat);
			} else if ( step.action == 'stay' && this.seats[0].activeseat() == step.seat ) {
				this.hand(step.seat).stay();
			} else if ( step.action == 'expose' && this.seats[0].activeseat() == step.seat ) {			
				this.hand(step.seat).expose();			
			} else if ( step.action == 'insurance' && step.seat > 0 && this.seats[0].activeseat() == 0 ) {
				this.insurance(step.seat);
			} else if ( step.action == 'even' && this.seats[step.seat].hand0.bj() ) {
				this.even(step.seat);
			} else if ( step.action == 'insurance' && !this.seats[0].hand0.checked ) {	
				console.log('check hole card insurance');
				this.seats[0].hand0.insurance();
				for (var x = 1; x < this.seats.length; x++) {
					if ( this.seats[x].hand0 && this.seats[x].hand0.insured ) {
						console.log('lost insurance bet');
						delete this.seats[x].hand0.insured;
					}
				}				
			} else if ( step.action == 'backdoor' && step.seat == 0 ) {
				console.log('check hole card backdoor');
				this.seats[step.seat].hand0.backdoor();			
			} else if ( step.action == 'deal' || step.action == 'wait'  && step.seat == 0) {
				this.deal(step.seat);
			} else if ( step.action == 'deal' || step.action == 'wait' && this.seats[0].activeseat() == step.seat) {
				this.deal(step.seat);
			} else if ( step.action == 'payout' && step.seat == 0 ) {
				this.payout();
			} else if (step.action == 'split' && this.seats[0].activeseat() == step.seat) {
				this.split(step.seat);
			} else {
				table.prototype.act.call(this, step);
			}
		} catch (err) {
			console.warn('blackjack act error:' + err);
			if ( err == 'Active Hand' ) {
				console.log('Active Hand Error');
				return;
			} else if ( err == 'Seat Not Taken' ) {
				console.log('Seat Not Taken');
				return;
			} else if ( err.toString().indexOf('Blackjack') > 0 ) {
				for (var x = 1; x < this.seats.length; x++) {
					if ( this.hand(x) ) {
						console.log('auto stay for blackjack - should we check all slots i.e. carribean');
						this.hand(x).stay();
					}
				}				
			}			
		}
	}
	
	table_blackjack.prototype.deal = function(seat) {
		if ( seat == 0 && this.seats[0].activeseat() == null  ) {
			if ( this.shoe.played > this.shoe.penetration ) {				
				this.shoe.shuffle();
				this.shoe.played = 0;
				return;
			} else if ( this.shoe.played == 0 ) {
				this.shoe.burn();
				return;
			}			
			this.freeze();
			return;
		}		
		if ( this.hand(seat) ) {
			this.hand(seat).deal( this.shoe.next(seat) );
		}
	}
	table_blackjack.prototype.deal2 = function(seat) {
		
		if ( seat == 0 && this.seats[0].activeseat() == null ) {
			console.log('deal played in shoe:' + this.shoe.played  + ' ' + this.shoe.penetration)
			 

			if ( !this.seats[0].hand(true) ) {
				table.prototype.deal.call(this);
				return;
			}
			
			this.seats[0].hand0 = new hand_blackjack_dealer();
			this.seats[0].hand0.soft17 = this.soft17;
				
			for (var y = 1; y <= 2; y++) {
	    		for (var x = 0; x < this.seats.length; x++) {
	    			var bump = ( x == this.seats.length - 1 ? 0 : x + 1);
	    			if ( this.seats[bump].hand0 ) {
	        			if ( !this.seats[bump].hand0.cards ) {
	    					var replacement = new hand_blackjack_player();
	    					if ( this.seats[bump].hand0.bet ) {
	    						replacement.bet = this.seats[bump].hand0.bet;
	    					}    			
	    					this.seats[bump].hand0 = replacement;
	        			}
	        			console.log('card ' + y + ' to ' + bump);
	        			this.hand(bump).deal( this.shoe.next(bump) );	        			
	    			}
	    		}
	    	}
				
		} else if ( this.hand(seat) && this.hand(seat).options().length == 1 ) {
			console.log( 'deal split' );
			this.hand(seat).deal( this.shoe.next(seat) );
			console.log( 'split aces' );
			return this.deal(seat);
		}
    }	
	
    table_blackjack.prototype.insurance = function(seat, amount) {
    	if ( this.seats[seat].hand0.insured ) {
			console.log('remove insurance');
			this.seats[seat].player.chips += (this.seats[seat].hand0.insurance ? this.seats[seat].hand0.insurance : 0);
			this.seats[seat].hand0.insured = null;
		} else if ( !this.seats[seat].hand0.bj() || (this.seats[seat].hand0.bj() && this.blackjackpays != '3 to 2' ) ) {
			console.log('buy insurance');
			var ins = this.seats[seat].hand0.bet / 2;
			if ( this.forless.indexOf('insurance') >= 0 && amount > 0 && ins > amount ) {
				ins = amount;
			}
			if ( ins <= this.seats[seat].player.chips ) {
				this.seats[seat].hand0.insured = ins;
				this.seats[seat].player.chips -= ins;				
			} else {
				console.log('lacks chips to insurance');
			}
		}
    }
    
    table_blackjack.prototype.freeze = function() {
    	table.prototype.freeze.call(this);
    	if ( this.seats[0].activeseat() > 0 ) {
    		this.seats[0].hand0 = new hand_blackjack_dealer();
    	} else {
    		console.log('no hands to match dealer')
    	}
    }
    
    
    
    table_blackjack.prototype.bet = function(seat, amount) {
    	if ( this.maximum && this.maximum <= amount ) {
    		amount = this.maximum;
    	}
    	table.prototype.bet.call(this, seat, amount);
    }
    
    table_blackjack.prototype.split = function(seat, amount) {
	    var splits = 0;
	    while ( this.seats[seat]['hand' + splits] ) {
	    	splits++;
	    }
    	console.log('split:' + splits);
    	if ( splits <= this.splitlimit ) {
    		var sb = this.hand(seat).bet;
    		if ( this.forless.indexOf('split') >= 0 && amount > 0 && amount < sb ) {
    			console.log('split for less');
    			sb = amount;
    		} else if ( this.fornothing.indexOf('split') >= 0 && amount == 0 ) {
    			console.log('split for nothing');
    			sb = amount;
    		}
    		if ( this.seats[seat].player.chips >= sb ) {
    			console.log('split hand');
    			var splithand = this.hand(seat).split();
    			if ( sb > 0 ) {
    				splithand.bet = sb;
    				this.seats[seat].player.chips -= sb;
    			}
    			this.seats[seat]['hand' + splits] = splithand;
    			this.deal( seat );
    		} else {
    			console.log('lacks chips to split');
    		}
    	}    	
    }
    
    table_blackjack.prototype.even = function(seat) {
    	console.log('even');
    	this.dispense(seat, this.seats[seat].hand0.bet * 2);
    	this.seats[seat].hand0.isBj = false;
    	this.seats[seat].hand0.stay();
    	delete this.seats[seat].hand0.bet;    	
    }
    
    table_blackjack.prototype.double = function(seat, amount) {
    	if ( this.hand(seat).options().indexOf('double') >= 0 && ( this.doubleon.length == 0 || this.doubleon.indexOf(this.hand(seat).value()) >= 0 )) {
	    	var db = this.hand(seat).bet;
			if ( this.forless.indexOf('double') >= 0 && amount > 0 && amount < db ) {
				console.log('double for less');
				db = amount;
			} else if ( this.fornothing.indexOf('double') >= 0 && amount == 0 ) {
				console.log('double for nothing');
				db = amount;
			}    		
			if ( this.seats[seat].player.chips >= db ) {
				console.log('double down');
				this.seats[seat].player.chips -= db;
	    		this.hand(seat).doubled = db;
	    		this.hand(seat).double( this.shoe.next(), this.downdirty );    		
	    	} else {
	    		console.log('lacks chips to double');
	    	}
    	} else {
    		console.log('lacks qualifying double hand');
    	}
    }    
    
    table_blackjack.prototype.collect = function(seat) {
    	if ( this.seats[seat].payout ) {
    		table.prototype.collect.call(this, seat);
    		if ( this.hand(seat,true) ) {
    			console.log('hand here');
    		}
    	}
    }

    table_blackjack.prototype.payout = function() {
    	console.log('called payout');
    	for (var x = 1; x < this.seats.length; x++) {
    		if ( this.seats[x].payout && this.seats[x].payout === 'number' ) {
    			this.seats[x].player.chips += this.seats[x].payout;
    			return;
    		}
    		if ( this.hand(x,true) ) {
    			if ( this.hand(x,true).unexposed ) {
    				console.log('expose card');
    				this.hand(x,true).expose();
    				return;
    			}    		
				if ( this.hand(x,true).winner(this.seats[0].hand0)  ) {
					console.log('winner!');
					if ( this.hand(x,true).bj() && !this.hand(x,true).isSplit  && !this.hand(x,true).doubled ) {
						if ( this.hand(x,true).bet ) {
							console.log('bj!');
							if ( this.blackjackpays == '3 to 2' ) {
								this.dispense( x, parseFloat(this.hand(x,true).bet) * 5 / 2 );
							} else if ( this.blackjackpays == '6 to 5' ) {
								this.dispense( x, parseFloat(this.hand(x,true).bet) * 11 / 5 );
							} else if ( this.blackjackpays == '1 to 1' ) {
								this.dispense( x, parseFloat(this.hand(x,true).bet) * 2 );
							}
						}
					} else {						
						console.log('straight winner');
						this.dispense( x,  this.hand(x,true).bet * 2 ); 
						if ( this.hand(x,true).doubled ) {
							console.log('double winner');
							this.dispense( x,  this.hand(x,true).doubled * 2 ); 
						}
					}	    					
				} else if ( this.hand(x,true).push(this.seats[0].hand0) ) {
					if ( this.hand(x,true).bet ) {
						console.log('push:' + this.hand(x,true).bet);
						this.dispense( x,  this.hand(x,true).bet );
						if ( this.hand(x,true).doubled ) {
							console.log('double winner');
							this.dispense( x,  this.hand(x,true).doubled );
						}
					}					
				} else if ( this.hand(x,true).insurance && this.seats[0].hand0.bj() ) {
					console.log('pay insurance');
					this.dispense( x, this.hand(x,true).insurance * 3 );
				} else {
					console.log('loser');
				}
				this.seats[0].history(x);
				return;
    		}
    	}
    	console.log('purge dealer hand');
    	this.seats[0].history(0);
    }

    return table_blackjack;
});