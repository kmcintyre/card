define(["table", "shoe", "hand_blackjack_dealer", "hand_blackjack_player"], function(table, shoe, hand_blackjack_dealer, hand_blackjack_player) {
		
	function table_blackjack() {
		table.call(this);
		this.nick = 'blackjack';
		this.shoe = new shoe();
		this.shoe.burn(1);
    	this.minimum = 100;
    	this.startingchips = 1000;
    	this.splitlimit = 3;
    	this.seats[0] = { label : 'Dealer', player : { name: 'Dealer', noOptions: true } };
    }
	
	table_blackjack.prototype = new table();
	table_blackjack.prototype.constructor=table_blackjack;

	table_blackjack.prototype.activeseat = function() {
		for (var x = 0; x < this.seats.length; x++) {
			var bump = ( x == this.seats.length - 1 ? 0 : x + 1);
			if ( this.hand(bump) ) {
				return bump;
			}
		}
	}

	table_blackjack.prototype.act = function(step) {
		console.log('blackjack act:' + step.action + ' seat:' + step.seat);
		try {
			if ( step.action == 'hit' ) {
				if ( this.activeseat() == step.seat ) {
					this.hand(step.seat).hit( this.shoe.next() );
				}				
			} else if ( step.action == 'double' ) {
				this.double(step.seat);
			} else if ( step.action == 'stay' ) {
				this.hand(step.seat).stay();
			} else if ( step.action == 'expose' ) {			
				this.hand(step.seat).expose();			
			} else if ( step.action == 'insurance' && step.seat > 0) {
				this.insurance(step.seat);
			} else if ( step.action == 'even' && this.seats[step.seat].hand0.bj() ) {
				this.even(step.seat);
			} else if ( step.action == 'insurance' && !this.seats[0].hand0.insured ) {	
				console.log('check hole card insurance');
				this.seats[0].hand0.insurance();
				for (var x = 1; x < this.seats.length; x++) {
					if ( parseInt(this.seats[x].hand0.insurance) > 0 ) {
						console.log('lost insurance bet');
						delete this.seats[x].hand0.insurance;
					}
				}
				
			} else if ( step.action == 'backdoor' && step.seat == 0 ) {
				console.log('check hole card backdoor');
				this.seats[step.seat].hand0.backdoor();			
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
			if ( err == 'Active Hand' ) {
				return
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
	
	table_blackjack.prototype.options = function() {
		table.prototype.options.call(this);
		if ( this.seats[0].hand0 ) {
			//console.log('check dealer');
			if ( this.seats[0].hand0.options().length == 1 && this.seats[0].hand0.options()[0] == 'insurance' ) {
				console.log('insurance');
				for (var x = 1; x < this.seats.length; x++) {
					if ( this.hand(x) ) {
						if ( this.hand(x).bj() ) {
							this.seats[x].options = ['even'];
						} else if ( this.hand(x).bet ) {
							this.seats[x].options = ['insurance'];
						} 
					}
				}			
			} else if ( this.seats[0].hand0.options().length == 1 && this.seats[0].hand0.options()[0] == 'backdoor' ) {
				console.log('backdoor');
				for (var x = 1; x < this.seats.length; x++) {
					if ( this.hand(x) ) {
						console.info('remove options for backdoor');
						this.seats[x].options = [];
					}
				}			
			} else if ( this.seats[0].hand0.options().length == 1 && this.seats[0].hand0.options()[0] == 'expose' ) {
				for (var x = 1; x < this.seats.length; x++) {
					if ( this.hand(x) ) {
						this.seats[0].options = [];
						//for (var y = x + 1; y < this.seats.length; y++) {
						//	console.log('remove later options');
						//	this.seats[y].options = [];
						//}						
					}
				}
			}			
		} else {
			for ( var x = 1; x < this.seats.length; x++) {
				if ( typeof this.seats[x].bet === 'number' ) {
					this.seats[0].options[this.seats[0].options.length] = 'deal';
					break;
				}
			}
			
		}
	}
	
	table_blackjack.prototype.deal = function(seat) {
		if ( seat == 0 ) {
			table.prototype.deal.call(this);
			this.seats[0].hand0 = new hand_blackjack_dealer();
			if ( this.shoe.played > this.shoe.penetration ) {
				this.shoe.shuffle();
				this.shoe.burn(1);
			}
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
		} else if ( this.hand(seat) ) {
			console.log('deal split');
			this.hand(seat).deal( this.shoe.next(seat) );			
		}
    }	
	
    table_blackjack.prototype.insurance = function(seat) {
    	if ( this.seats[seat].hand0.insurance ) {
			console.log('remove insurance');
			this.seats[seat].player.chips += this.seats[seat].hand0.insurance;
			delete this.seats[seat].hand0.insurance;
		} else {
			console.log('buy insurance');
			this.seats[seat].hand0.insurance = this.seats[seat].hand0.bet / 2;
			this.seats[seat].player.chips -= this.seats[seat].hand0.insurance;
		}
    }
    
    table_blackjack.prototype.split = function(seat) {
    	var splits = 0;
    	while ( this.seats[seat]['hand' + splits] ) {
    		splits++;
    	}
    	console.log('split:' + splits);
    	if ( splits <= this.splitlimit ) {
    		var splithand = this.hand(seat).split();
    		console.log('split hand:' + splithand);
        	if ( this.hand(seat).bet ) {
        		splithand.bet = this.hand(seat).bet;        
        		this.seats[seat].player.chips -= this.hand(seat).bet;
        	}
        	this.seats[seat]['hand' + splits] = splithand;
        	console.log(this.seats[seat]['hand' + splits]);
    	}
    }
    
    table_blackjack.prototype.even = function(seat) {
    	console.log('even');
    	this.seats[seat].player.chips += this.seats[seat].hand0.bet * 2;
    	this.seats[seat].hand0.stay();
    	delete this.seats[seat].hand0.bet;    	
    }
    
    table_blackjack.prototype.double = function(seat) {
    	console.log('double down:' + this.seats[seat].player.chips);
    	this.seats[seat].player.chips -= this.hand(seat).bet;
    	console.log('double down:' + this.seats[seat].player.chips);
    	this.hand(seat).bet = this.hand(seat).bet * 2;
    	this.hand(seat).double( this.shoe.next() );
    }    

    table_blackjack.prototype.payout = function() {
    	console.log('called payout');
    	for (var x = 1; x < this.seats.length; x++) {
    		console.log('check hand:' + x);
    		if ( this.hand(x,true) ) {
    			if ( this.hand(x,true).unexposed ) {
    				console.log('expose card');
    				this.hand(x,true).expose();
    				return;
    			}    		
				if ( this.hand(x,true).winner(this.seats[0].hand0)  ) {
					console.log('winner!');
					if ( this.hand(x,true).bj() && !this.hand(x,true).isSplit ) {
						if ( this.hand(x,true).bet ) {
							console.log('bj!');
							this.seats[x].player.chips += this.hand(x,true).bet * 2.5
						}
					} else {						
						console.log('straight winner');
						this.seats[x].player.chips += this.hand(x,true).bet * 2
					}	    					
				} else if ( this.hand(x,true).push(this.seats[0].hand0) ) {
					if ( this.hand(x,true).bet ) {
						console.log('push:' + this.hand(x,true).bet);
						this.seats[x].player.chips += this.hand(x,true).bet;							
					}
				} else if ( this.hand(x,true).insurance && this.seats[0].hand0.bj() ) {
					console.log('pay insurance');
					this.seats[x].player.chips += this.hand(x,true).insurance * 2;
				} else {
					console.log('loser');
				}
				delete this.seats[x].hand0;				
				for (var y = 1; y <= this.splitlimit; y++) {
					if ( this.seats[x]['hand' + y] ) {
						console.info('move:' + y + ' to '+ (y-1) );
						this.seats[x]['hand' + (y-1)] = this.seats[x]['hand' + y];						
						delete this.seats[x]['hand' + y];
					}
				}
				return;
    		}
    	}
    	console.log('purge dealer hand');
    	delete this.seats[0].hand0;
    }

    return table_blackjack;
});