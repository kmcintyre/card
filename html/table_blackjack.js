define(["table", "shoe", "hand_blackjack_dealer", "hand_blackjack_player"], function(table, shoe, hand_blackjack_dealer, hand_blackjack_player) {
	
	function dealer(seats) {
		
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
	
	function table_blackjack() {
		table.call(this);
		this.shoe = new shoe(2);
		this.shoe.burn(1);
		this.minimum = 5;
    	//this.maximum = 1000;    
    	this.splitlimit = 3;    	
    	this.forlesssplit = false;
    	this.forlessdouble = true;
    	this.downdirty = true;    	
    	this.addseat();
    	this.seats[0].chair = 'Dealer';
    	this.sit(0, { name: 'Dealer'});
    	delete this.seats[0].player.chips;  
    	this.seats[0] = new dealer(this.seats);    	
    }
	
	table_blackjack.prototype = new table();
	table_blackjack.prototype.constructor=table_blackjack;
	
	table_blackjack.prototype.simple = function() {
		var j = table.prototype.simple.call(this);
		j['minimum'] = this.minimum;
		j['maximum'] = this.maximum;
		j['splitlimit'] = this.splitlimit;
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
		console.log('blackjack act:' + step.action + ' seat:' + step.seat + ' active' + this.seats[0].activeseat());
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
			} else if ( step.action == 'insurance' && !this.seats[0].hand0.insured ) {	
				console.log('check hole card insurance');
				this.seats[0].hand0.insurance();
				for (var x = 1; x < this.seats.length; x++) {
					if ( this.seats[x].hand0 && this.seats[x].hand0.insurance ) {
						console.log('lost insurance bet');
						delete this.seats[x].hand0.insurance;
					}
				}				
			} else if ( step.action == 'backdoor' && step.seat == 0 ) {
				console.log('check hole card backdoor');
				this.seats[step.seat].hand0.backdoor();			
			} else if ( step.action == 'deal' && step.seat == 0) {
				this.deal(step.seat);
			} else if ( step.action == 'deal' && this.seats[0].activeseat() == step.seat) {
				this.deal(step.seat);
			} else if ( step.action == 'payout' && step.seat == 0 ) {
				this.payout();
			} else if (step.action == 'split' && this.seats[0].activeseat() == step.seat) {
				this.split(step.seat);
			} else {
				table.prototype.act.call(this, step);
			}
			if ( (step.action == 'hit' || step.action == 'double' || step.action == 'stay') && this.seats[0].activeseat() == step.seat && this.hand(step.seat) && this.hand(step.seat).options()[0] == 'deal' ) {
				this.deal(step.seat);
			} 
		} catch (err) {
			if ( err == 'Active Hand' ) {
				return;
			}
			console.log('we got a blackjack!' + err);
			for (var x = 1; x < this.seats.length; x++) {
				if ( this.hand(x) ) {
					console.log('auto stay');
					this.hand(x).stay();
				}
			}
		}
	}
	
	table_blackjack.prototype.deal = function(seat) {
		if ( seat == 0 && this.seats[0].activeseat() == null ) {
			console.log('deal played in shoe:' + this.shoe.played && this.shoe.penetration)
			if ( this.shoe.played > this.shoe.penetration ) {
				this.shoe.shuffle();
				this.shoe.played = 0;
				this.shoe.burn(1);
			} 
			if ( !this.seats[0].hand(true) ) {
				this.seats[0].hand0 = new hand_blackjack_dealer();

				table.prototype.deal.call(this);			
				
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
			} else {
				console.log('not okay');
			}
		} else if ( this.hand(seat) && this.hand(seat).options().length == 1 ) {
			console.log( 'deal split' );
			this.hand(seat).deal( this.shoe.next(seat) );
			console.log( 'split aces' );
			return this.deal(seat);
		}
    }	
	
    table_blackjack.prototype.insurance = function(seat) {
    	if ( this.seats[seat].hand0.insurance ) {
			console.log('remove insurance');
			this.seats[seat].player.chips += (this.seats[seat].hand0.insurance ? this.seats[seat].hand0.insurance : 0);
			delete this.seats[seat].hand0.insurance;
		} else if ( !this.seats[seat].hand0.bj() ) {
			console.log('buy insurance');
			this.seats[seat].hand0.insurance = this.seats[seat].hand0.bet / 2;
			this.seats[seat].player.chips -= (this.seats[seat].hand0.insurance ? this.seats[seat].hand0.insurance : 0);
		} else {
			console.log('not bought');
		}
    }
    
    table_blackjack.prototype.split = function(seat) {
	    var splits = 0;
	    while ( this.seats[seat]['hand' + splits] ) {
	    	splits++;
	    }
    	console.log('split:' + splits);
    	if ( splits <= this.splitlimit && (this.seats[seat].player.chips >= this.hand(seat).bet || (this.forlesssplit && this.seats[seat].player.chips > 0) ) ) {
    		var splithand = this.hand(seat).split();
    		console.log('split hand:' + splithand);
        	if ( this.hand(seat).bet ) {
        		splithand.bet = this.hand(seat).bet;        
        		this.seats[seat].player.chips -= this.hand(seat).bet;
        		if ( this.seats[seat].player.chips < 0 ) {
        			splithand.bet += this.seats[seat].player.chips;
        			this.seats[seat].player.chips = 0;
        		}
        	}
        	this.seats[seat]['hand' + splits] = splithand;
        	this.deal( seat );
    	}
    	
    }
    
    table_blackjack.prototype.even = function(seat) {
    	console.log('even');
    	this.dispense(seat, this.seats[seat].hand0.bet * 2);
    	this.seats[seat].hand0.isBj = false;
    	this.seats[seat].hand0.stay();
    	delete this.seats[seat].hand0.bet;    	
    }
    
    table_blackjack.prototype.double = function(seat) {
    	if ( this.seats[0].activeseat() == seat ) {
    		if ( this.seats[seat].player.chips >= this.hand(seat).bet) {
    			this.seats[seat].player.chips -= (this.hand(seat).bet ? this.hand(seat).bet: 0);
    			this.hand(seat).doubled = (this.hand(seat).bet ? this.hand(seat).bet: 0);
    			console.log('double down:' + this.hand(seat).doubled);
    			this.hand(seat).double( this.shoe.next(), this.downdirty );
    		} else if ( this.seats[seat].player.chips > 0 && this.forlessdouble ) {
    			this.hand(seat).doubled = this.seats[seat].player.chips;
    			this.seats[seat].player.chips = 0;
    			this.hand(seat).double( this.shoe.next(), this.downdirty );
    		}
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
							this.dispense( x, parseFloat(this.hand(x,true).bet) * 2.5 ); 
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