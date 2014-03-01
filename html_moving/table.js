define(function() {

	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		             .toString(16)
		             .substring(1);
	};

	function guid() {
		//return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	     //    s4() + '-' + s4() + s4() + s4();
		return s4();
	}
	
	function seat() {
		this.chair = null;
		this.locked = false;
		this.options = function() {
			var opts = [];
			if ( !this.player ) {
				opts[opts.length] = 'sit';
			} else {
				if ( this.locked ) {
					opts[opts.length] = 'unlock';
				} else {
					opts[opts.length] = 'lock';
				}
			}
			if ( this.payout ) {
				opts[opts.length] = 'collect';				
			}
			if ( !this.hand(true) ) {
				opts[opts.length] = 'bet';
			}		
			if ( this.bet ) {
				opts[opts.length] = 'cancel';
			}
			return opts;
		}
		this.simplehands = function(obj) {
			for (var x = 0;; x++) {
				if ( this['hand' + x] ) {
					obj['hand' + x] = this['hand' + x].simple();
				} else {
					break;
				}
			}
			return obj;
		}		
		this.simple = function() {
			return this.simplehands({ 
				chair: this.chair, 
				options : this.options(), 
				player: this.player,				
				bet: this.bet,
				payout: this.payout 
				});
		}		
	}
	
	seat.prototype.hand  = function(inactive) {
		for (var x = 0;; x++) {			
			if ( this['hand' + x] && (this['hand' + x].options().length > 0 || inactive)) {
				return this['hand' + x];
			} else if ( !this['hand' + x] ) {
				//console.log('null hand:' + x);
				return null;
			}
		}
	}	
	
	function table() {
		this.id = guid(); 
		this.title = 'Untitled';
		this.locked = false;
		this.seats = new Array();
		this.chips = 0;
		this.minimum = 0;
		this.ante = 0;
		this.denomination = 1;
		this.maxseats = 10; // so 0-9 otherwise some matching fails
	};

	table.prototype.hand = function(seat, inactive) {
		//console.log('hand:' + seat);
		return this.seats[seat].hand(inactive);
	}	
	
	table.prototype.paint = function() {
		throw "Paint Shit";
	}
	
	table.prototype.simple = function() {
		var t = { 
				id: this.id, 
				title: this.title, 
				options: this.options(),
				minimum: this.minimum,
				denomination: this.denomination,
				ante: this.ante,
				seats: new Array() 
		};
		for (var x = 0; x < this.seats.length; x++) {
			t.seats[t.seats.length] = this.seats[x].simple();
		}		
		return t;
	}
	
	table.prototype.act = function(step) {
		if ( step.action == 'sit' ) {
			this.sit(step.seat, step);
		} else if ( step.action == 'dispense' ) {
			this.dispense(step.seat, step.amount);									
		} else if ( step.action == 'deal' ) {
			this.deal(step.seat);				
		} else if ( step.action == 'stand' ) {
			this.stand(step.seat);
		} else if ( step.action == 'bet' ) {
			this.bet(step.seat, step.amount);
		} else if ( step.action == 'collect' ) {
			this.collect(step.seat);
		} else if ( step.action == 'lock' && !step.seat ) {			
			this.locked = true;
		} else if ( step.action == 'lock' && step.seat ) {
			this.seats[step.seat].locked = true;
		} else if ( step.action == 'unlock' && !step.seat ) {
			this.unlock = false;
		} else if ( step.action == 'unlock' && step.seat ) {
			this.seats[step.seat].locked = false;
		} else if ( step.action == 'addseat' && ( this.seats.length < this.maxseats || !this.maxseats  )) {
			this.addseat();
		} else if ( step.action == 'fold' ) {
			this.seats[step.seat].hand().fold();
		} else {
			throw 'Unknown Act'
		}
	}
	
	table.prototype.options = function() {
		var opts = new Array('about');
		if ( !this.locked ) {
			opts[opts.length] = 'configure';
			if ( this.seats.length < this.maxseats || this.maxseats == 0 ) {
				opts[opts.length] = 'add seat';
			}			
		}
		return opts;
	}
	
	table.prototype.addseat = function() {
		console.log('add seat:' + this.seats.length);		
		var s = new seat();
		s.chair = 'Seat ' + this.seats.length;
		this.seats[this.seats.length] = s;
	}
	
    table.prototype.sit = function(seat, person) {
    	console.log('sit:' + seat + ' name:' + person.name);
    	if ( this.seats[seat].player ) {
    		throw "Seat Unavailable";
    	} else {
    		console.log('welcome:' + person.name );
			this.seats[seat].player = { name: (person.name?person.name:'Anonymous'), chips: (person.chips?person.chips:5000) };			
    	}    	
    }
    
    table.prototype.dispense = function(seat, amount) {
    	amount = parseFloat(amount);
    	if ( !amount ) { console.log('dispense nothing'); return; }
    	if ( !this.seats[seat].payout ) { this.seats[seat].payout = 0; }
    	this.seats[seat].payout += amount;
    }
    
    table.prototype.collect = function(seat) {
    	if ( this.seats[seat].payout ) {
    		this.seats[seat].player.chips += this.seats[seat].payout;
    		delete this.seats[seat].payout;
    	}
    }    
    
    table.prototype.bet = function(seat, amount) {
    	amount = parseFloat(amount);
    	if ( !amount ) { amount = 0; }
    	console.info('bet amount:' + amount + ' chips:' + this.seats[seat].player.chips + ' ante:' + this.ante);
    	if ( this.seats[seat].bet || typeof this.seats[seat].bet === 'number' ) {
    		console.log('cancel existing bet');
    		this.seats[seat].player.chips += this.seats[seat].bet;
    		delete this.seats[seat].bet;
    		if ( this.seats[seat].ante ) {
    			this.seats[seat].player.chips += this.seats[seat].ante;
    			delete this.seats[seat].ante;
    		}
    		if ( amount == 0 || amount < this.minimum ) {
    			return;
    		}
    	}    	
    	if ( amount >= this.minimum && this.seats[seat].player.chips >= amount + this.ante ) {    		
    		if ( amount % this.denomination > 0 ) {
    			console.log('tweaking down bet for denomination');
    			amount = amount - (amount % this.denomination);
    		}
    		this.seats[seat].bet = amount;
    		this.seats[seat].player.chips -= amount;
    		if ( this.ante > 0 ) {
    			this.seats[seat].player.chips -= this.ante;
    			this.seats[seat].ante = this.ante;
    		}
    	} else {
    		console.log('player lacks chips or under bet table minimum');
    	}
    }
    
    table.prototype.createhand = function(bet) {
    	throw "Not Implemented";
    }
        
    table.prototype.freeze = function() {
    	console.log('deal!');
    	for (var x = 0; x < this.seats.length; x++) {
    		try {
	    		if ( this.seats[x].player && typeof this.seats[x].bet === 'number') {
	    			console.log('create hand with bet:' + this.seats[x].bet + ' at seat:' + x);
    				this.seats[x].hand0 = this.createhand(this.seats[x].bet);
    				delete this.seats[x].bet;
    				if ( this.seats[x].ante ) {
    					console.log('add ante');
    					this.seats[x].hand0.ante = this.seats[x].ante;
    					delete this.seats[x].ante;
    				}
	    		}
    		} catch (err) {
    			console.log('skipping seat:' + x);
    		}
    	}    	
    }
    
    table.prototype.stand = function(seat) {
    	if ( this.seats[seat].player ) {
    		if ( this.seats[seat].hand() ) {
    			throw "Active Hand";
    		} else if ( this.seats[seat].hand(true) ) {
    			throw "Inactive Hand";
    		}
    		if ( this.seats[seat].bet || typeof this.seats[seat].bet === 'number' ) {
    			console.log('your bet sir!');
    			this.seats[seat].player.chips = this.seats[seat].player.chips + this.seats[seat].bet;
    			delete this.seats[seat].bet;
    		}
    		delete this.seats[seat].player;
    	} else {
    		throw "Seat Not Taken";
    	}
    }
	
	table.prototype.toString = function() {
  		return 'id:' + this.id + ' seats:' + this.seats;
    }
	
	return table;
});