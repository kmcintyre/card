define(function() {

	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		             .toString(16)
		             .substring(1);
	};

	function guid() {
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	         s4() + '-' + s4() + s4() + s4();
	}
	
	function table(t) {
		if ( t ) {
			try {			
				console.log( 'table id-' + t.id );
				this.id = t.id;
				if ( t.seats && t.seats.length > 0 ) {
					console.log('has seats:' + t.seats.length);
					this.seats = new Array();					
					for (var x = 0; x < t.seats.length; x++) {
						this.addseat();
						if ( t.seats[x].player ) {
							console.info('sit incoming');
							this.sit(x, { name: t.seats[x].player.name } );
						}						
					}
				} else {
					this.seats = new Array();					
				}
			} catch (err) {
				console.log('bad table:' + err);
				throw err;
			}			
		} else {
			console.log( 'blank');
			this.id = guid();			
			this.seats = new Array();			
		}		
	};
	
	table.prototype.paint = function() {
		throw "Paint Shit";
	}
	
	table.prototype.json = function() {
		return JSON.stringify( { id: this.id, seats: this.seats } );
	}
			
	table.prototype.options = function(x) {
		var opts = [];
		if ( this.seats[x].player ) {
			opts[opts.length] = 'stand';
			if ( this.seats[x].bet ) {
				opts[opts.length] = 'bet';
			}
			if ( this.seats[x].hand ) {
				console.log('check hand options');
				opts = opts.concat(this.seats[x].hand.options());
			}			
		} else {
			opts[opts.length] = 'sit';
		}
		return opts;		
	}
	
	table.prototype.addseat = function() {
		console.log('add seat');		
		this.seats[this.seats.length] = {}; 
	}
	
    table.prototype.sit = function(seat, person) {
    	console.log('sit:' + seat);
    	if ( this.seats[seat].player ) {
    		throw "Seat Unavailable";
    	} else if ( !person.name ) {
    		throw "Need a name";
    	} else {
    		console.log('welcome:' + person.name );
			this.seats[seat].player = person;
			this.seats[seat].bet = {};
			this.seats[seat].hand = {};
			this.seats[seat].payout = {};
    	}
    	
    }
	
	table.prototype.hands = function() {
    	for (var x = 0; x < this.seats.length; x++ ) {
    		if ( this.seats[x].hand != null ) {
    			return true;
    		}
    	}
    	return false;		
	}
	
	table.prototype.bets = function() {
    	for (var x = 0; x < this.seats.length; x++ ) {
    		if ( this.seats[x].bet != null ) {
    			return true;
    		}
    	}
    	return false;		
	}	
    
    table.prototype.collect = function(seat) {
    	if ( this.seats[seat].player && this.seats[seat].collect ) {
    		this.seats[seat].player.chips = this.seats[seat].player.chips + this.seats[seat].collect;
    		this.seats[seat].collect = null;
    	} else {
    		console.log('skip collect');
    	}
    }
    
	table.prototype.bet = function(seat, amount) {
		if ( this.seats[seat].player ) {
			if ( this.seats[seat].bet == null && amount > 0) {
				console.log('bet:' + amount);
				this.seats[seat].bet = amount;
				this.seats[seat].player.chips = this.seats[seat].player.chips - amount;
			} else if ( this.seats[seat].bet != null ) {
				var diff = amount - this.seats[seat].bet;
				console.log('bet diff:' + diff);
				if ( Math.abs(diff) > 0 ) {
					this.seats[seat].bet = this.seats[seat].bet + diff;
					this.seats[seat].player.chips = this.seats[seat].player.chips - diff;
				}			
				if ( this.seats[seat].bet == 0 ) {
					console.log('remove bet');
					this.seats[seat].bet == null;
				}							
			} else {
				console.log('bet ignored');
			}
		} else {
			console.log('bet with no player');
		}
	}

    table.prototype.stand = function(seat) {
    	if ( this.seats[seat] && !this.seats[seat].hand && this.seats[seat].player ) {
    		if ( this.seats[seat].payout ) {
    			console.log('your payout sir!');
    			this.seats[seat].player.give(this.seats[seat].payout);
    			this.seats[seat].payout = null;
    		}         		
    		if ( this.seats[seat].bet ) {
    			console.log('your bet sir!');
    			this.seats[seat].player.give(this.seats[seat].bet);
    			this.seats[seat].bet = null;
    		}
    		console.log('stand:' + seat + ' ' + this.seats[seat].player );
    		this.seats[seat].player = null;    		
    	} else if (this.seats[seat].hand) {
    		throw "Active Hand";
    	} else if ( !this.seats[seat].player ) {
    		throw "Seat Not Taken";
    	} else {
    		throw "Something Else";
    	}
    }
	
	table.prototype.toString = function() {
  		return 'id:' + this.id + ' seats:' + this.seats;
    }
	
	return table;
});