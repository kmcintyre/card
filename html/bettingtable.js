define(function() {

	function table(number_of_seats) {
		console.log('new table:' + number_of_seats);		
		this.seats = new Array(number_of_seats);    	
		for (var x = 0; x < number_of_seats; x++) {
			console.log('gen seat');
			this.seats[x] = { 
					player: null, 
					bet: null,
					hand: null, 
					toString: function() {						
						return (this.player ? this.player.toString() + ' ' + (this.bet ? 'bet:' + this.bet.toString() : 'no bet')  + (this.hand ? ' hand:' + this.hand.toString() : ' no hand') : 'empty seat')  ; 
						} 
			};
		}
	};
	
	bettingtable.prototype.collect = function(seat) {
		console.log('collect bets' + this.seats[seat].bet);
		if ( this.seats[seat].bet != null ) {
			this.chips = this.chips + parseInt(this.seats[seat].bet);
			this.seats[seat].bet = null;
		} 
	}
	
	bettingtable.prototype.dispense = function(seat, amount) {
		console.log('place winnings:' + amount);
		if ( this.seats[seat].bet == null ) {
			this.seats[seat].bet = amount;
		} else {
			this.seats[seat].bet = this.seats[seat].bet + amount;
		}
		this.chips = this.chips - amount; 		
	}

    table.prototype.hands = function() {
    	for (var x = 0; x < this.seats.length; x++) {
    		if ( this.seats[x].hand != null ) {
    			return true;
    		}
    	}
    	return false;
    }
    
    table.prototype.bets = function() {
    	for (var x = 0; x < this.seats.length; x++) {
    		if ( this.seats[x].bet != null ) {
    			return true;
    		}
    	}
    	return false;
    }
	
	table.prototype.bet = function(seat, amount) {
		try {
			console.log('bet:' + amount + ' seat:' + seat + ' player chips:' + this.seats[seat].player.chips + ' current bet:' + this.seats[seat].bet );
			if ( amount >= 0 && amount <= this.seats[seat].player.chips ) {
				if ( this.seats[seat].bet ) {					
					this.seats[seat].bet = this.seats[seat].bet + amount; // add to bet if not null
					console.log('add to bet:' + this.seats[seat].bet);
				} else {					
					this.seats[seat].bet = amount;
					console.log('set bet:' + amount);
				} 
				this.seats[seat].player.chips = this.seats[seat].player.chips - amount;
			} else {
				console.log('bet not thesible');
			}
		} catch (err) {
			console.warn('bet for seat:' + seat + ' error:' + err);
		}
	}
		
    table.prototype.sit = function(seat, p) {
    	console.log('sit:' + p + ' at:' + seat);
    	if ( this.seats[seat] ) {
    		console.log('right here:' + this.seats[seat]);
    		if ( this.seats[seat].player != null ) {
    			console.log('excuse me:' + this.seats[seat].player.toString());
    			throw "Seat Taken";
    		} else {
    			console.log('your seat sir');
    			this.seats[seat].player = p;
    		}
    	} 
    	throw "Seat Unavailable"; 
    }	
	
	table.prototype.toString = function() {
  		return this.seats.length + ' seats:' + this.seats.toString();
    }
	
	return table;
});