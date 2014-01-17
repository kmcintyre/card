define(["hand"], function(hand) {

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
	
	function table() {
		this.id = guid(); 
		this.nick = 'Untitled';
		this.seats = new Array();		
	};
	
	table.prototype.paint = function() {
		throw "Paint Shit";
	}
	
	table.prototype.has = function(attr, seat) {
		if ( seat != undefined && parseInt(seat) >= 0 ) {
			//console.log('check individual:' + seat + ' ' + attr);
			return (this.seats[seat][attr] ? true : false);
		} else {
			//console.log('check all:' + attr);
			for (var x = 0; x < this.seats.length; x++) {
				if ( this.seats[x][attr] ) {
					return true;
				}
			}	
			return false;			
		}
	}
	
	table.prototype.json = function() {
		return JSON.stringify( { id: this.id, nick: this.nick, seats: this.seats } );
	}
	
	table.prototype.act = function(step) {
		console.log('table act:' + step.action);
		if ( step.action == 'sit' ) {
			this.sit(step.seat, step);
		} else if ( step.action == 'stand' ) {
			this.stand(step.seat);
		} else if ( step.action == 'bet' ) {
			this.bet(step.seat, step.amount);
		}
	}
	
	table.prototype.options = function() {
		for (var x = 0; x < this.seats.length; x++) {
			var opts = [];			
			if ( this.seats[x].hand ) {
				try {
					opts = opts.concat(this.seats[x].hand.options());
				} catch (err) { 
					console.log('error with hand options' + err);
				}			
			} else if ( this.seats[x].player && !this.seats[x].player.noOptions ) {
				opts[opts.length] = 'stand';
				if ( typeof this.seats[x].player.chips === 'number' || typeof this.seats[x].player.bet === 'number' ) {
					opts[opts.length] = 'bet';
				} else {
					opts[opts.length] = 'buy';
				}
			} else {
				opts[opts.length] = 'sit';
			} 			
			
			this.seats[x].options = opts;
		}
	}

	table.prototype.addseat = function() {
		console.log('add seat:' + this.seats.length);
		this.seats[this.seats.length] = { 
				label : 'Seat ' + this.seats.length			
		};
	}
	
    table.prototype.sit = function(seat, person) {
    	console.log('sit:' + seat + ' name:' + person.name);
    	if ( this.seats[seat].player ) {
    		throw "Seat Unavailable";
    	} else if ( !person.name ) {
    		throw "Need a name";
    	} else {
    		console.log('welcome:' + person.name );
			this.seats[seat].player = { name: person.name, chips: 0 };			
    	}    	
    }

    table.prototype.bet = function(seat, amount) {
    	amount = parseInt(amount);
    	if ( !amount ) { amount = 0; }
    	console.info('bet amount:' + amount);
    	if ( this.seats[seat].player && amount >= 0 ) {
    		if ( this.seats[seat].player.chips ) {
    			console.log('player has chips:' + this.seats[seat].player.chips);
    		} else {
    			console.log('player has no chips');
    			this.seats[seat].player.chips = 0;
    		}
    		if ( this.seats[seat].bet ) {
    			var diff = this.seats[seat].bet - amount;
    			this.seats[seat].bet = amount;
    			if ( amount == 0 ) {
    				console.log('remove bet');
    				delete this.seats[seat].bet;
    			} else {
    				this.seats[seat].bet = amount;
    			}
    			this.seats[seat].player.chips += diff; 
    		} else if ( amount > 0 ) {
    			console.log('create bet');
        		if ( amount > this.seats[seat].chips ) {
        			console.log('all in');
        			amount = this.seats[seat].chips;
        		}    			
    			this.seats[seat].bet = amount;
    			this.seats[seat].player.chips -= amount;
    		}
    	} else {
    		throw "no bet";
    	}
    }
        
    table.prototype.deal = function() {
    	console.log('deal!');
    	if ( this.has('hand') ) {
    		throw "Hand In Progress";
    	}    	
    	for (var x = 0; x < this.seats.length; x++) { 
    		if ( this.seats[x].player && this.seats[x].bet ) {
    				console.log('create hand with bet:' + this.seats[x].bet);
    				this.seats[x].hand = { bet:this.seats[x].bet };
    				delete this.seats[x].bet;
    		}    			    		    		    		
    	}    	
    }    
    
    table.prototype.stand = function(seat) {
    	console.log('stand:' + seat + ' ' + this.seats[seat].player );
    	if ( this.seats[seat].player ) {
    		if (this.seats[seat].hand) {
        		throw "Active Hand";
        	} 
    		if ( this.seats[seat].bet && this.seats[seat].player.chips ) {
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



/*
if ( this.seats[x].hand instanceof Array ) {
for (var y = 0; y < this.seats[x].hand.length; y++) {
	console.log('check split for options:' + this.seats[x].hand[y].options());
	if ( this.seats[x].hand[y].options().length > 0 ) {
		opts = opts.concat(this.seats[x].hand[y].options());
		break;
	}
}
} else {
*/