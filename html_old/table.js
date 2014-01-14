define(["shoe", "bjhand", "player"], function(shoe, bjhand, player) {

    function table() { 
    	this.seats = new Array(8);
    	this.shoe = new shoe();
    	this.minimum = 100; 
    	this.burn(1);
    	this.timer = null;
    };
           
    table.prototype.burn = function(number_of_cards) {
    	if ( number_of_cards > 0 ) { 
    		return this.shoe.next() + this.burn(number_of_cards--);
    	}    	
    }
    
    table.prototype.playAfter = function(secs) {
    	console.info('delayed play:' + secs);
    	try {
    		window.clearTimeout(this.timer);
    	} catch (err) {
    		console.info('yo:' + err);
    	}
		var self = this;
		this.timer = setTimeout( function(){self.play()}, secs * 1000 );
    }
    
    table.prototype.sit = function(seat, p) {
    	console.info('sit player:' + p);
    	if ( !this.seats[seat] && seat >= 0 && seat < this.seats.length ) {
    		this.seats[seat] = p;
    		this.playAfter(1);
    	}
    }
    
    table.prototype.player = function(seat) {
    	if ( this.seats[seat] instanceof player ) {
    		return this.seats[seat]; 
    	} else if ( this.seats[seat] instanceof bjhand ) {
    		return this.seats[seat].player; 
    	} else if ( this.seats[seat][0] instanceof player ) {
    		return this.seats[seat][0]; 
    	} 
    	throw "no player";
    }
    
    table.prototype.hand = function(seat) {
    	//console.info('attempt hand:' + seat);
    	if ( this.seats[seat] ) {
    		if ( this.seats[seat] instanceof bjhand ) {
    			//console.info('got hand:' + seat);
    			return this.seats[seat];
    		}
    	} 
    	throw "no hand";
    }
    
    table.prototype.bet = function(seat, bet) {
    	if ( this.hands() ) {
    		throw "no betting";
    	}
    	if ( this.seats[seat] instanceof player && bet ) {
    		console.info('bet:' + bet + ' seat' + seat + ' assumimg sitting player betting');
    		if ( bet < this.minimum ) {    			
    			bet = this.minimum;
    		} 
    		if ( bet > this.seats[seat].chips ) {
    			bet = this.seats[seat].chips;
    		}
    		this.seats[seat].chips = this.seats[seat].chips - bet;
    		console.info('array player,bet with bet:' + bet);
    		this.seats[seat] = [this.seats[seat],bet];
    		
    		this.playAfter(3);
    		
    	} else if ( this.seats[seat] instanceof bjhand ) {
    		return this.seats[seat].bet;    		
    	} else if ( this.seats[seat][1] ) {
    		return this.seats[seat][1];    		
    	} else {
    		throw "no bet";
    	}
    }
    
    table.prototype.bets = function() {
    	var b = new Array();
    	for (var x = 0; x < this.seats.length - 1; x++) {    		
    		if ( this.seats[x] ) {
    			console.info('check for bets');
    			if ( this.seats[x] instanceof Array) {
    				console.info('found one:' + this.seats[x][1]);
    				b[b.length] = this.seats[x][1];
    			}
    		}
    	}
    	return b;    	
    }
    
    table.prototype.solicitbets = function() {    	
    	for (var x = 0; x < this.seats.length - 1; x++) {
    		if ( this.seats[x] instanceof player ) {    			
    			this.seats[x].client.send(JSON.stringify({"type": "bet", "min" : Math.min(this.minimum,this.seats[x].chips), "max" : this.seats[x].chips }));
    		}
    	}
    }
            
    table.prototype.hands = function() {
    	for (var x = 0; x < this.seats.length; x++) {
    		if ( this.seats[x] && this.seats[x] instanceof bjhand ) {
    			return true;
    		}
    	}
    	return false;
    }
        
    table.prototype.insurance = function(bj) {    	
    	var self = this;
    	this.timer = setTimeout( function() { 
    		if ( bj ) {
    			for (var x = 0; x < self.seats.length - 1; x++) {
    				try { 
    					self.hand(x).stay();
    				} catch (err) {
    					console.info('insurance error:' + x)
    				}
    			}
    		}  
    		self.play();
    	}, 5000);
    }
    
    table.prototype.payout = function(h) {
    	if ( h.value() > 21 ) {
    		return;
    	} else if ( h.value() == 21 && h.cards.length == 2 ) {    		
    		if ( this.seats[this.seats.length - 1].value() == 21 && this.seats[this.seats.length - 1].cards.length == 2 ) {
    			return;
    		} else {
    			h.player.chips = h.player.chips + h.bet + (h.bet * 1.5);
    		}
		} else if ( this.seats[this.seats.length - 1].value() == 21 && this.seats[this.seats.length - 1].cards.length == 2 ) { 
			return;
		} else if ( h.value() == this.seats[this.seats.length - 1].value() ) {
			return;
		} else if ( h.value() > this.seats[this.seats.length - 1].value() ) {
			h.player.chips = h.player.chips + h.bet;
		} else {
			//
		}
    }
    
    table.prototype.play = function() {
    	console.info('play');
    	if ( this.hands() ) {
    		for (var x = 0; x < this.seats.length; x++) {
    			try {
    				if ( this.hands(x).option("autohit") ) {
    					console.info('autohit');
    					this.hands(x).cards[this.hands(x).cards.length] = this.shoe.next();
    				}    				
    				var self = this;
    				this.timer = setTimeout( function(){self.play()},3000);
    				return;
    			} catch (err) {
    				console.info('no hand to play');
    			}
    		}    		
    		//this.timer = setTimeout( function(){self.play()},1000);								
    		//} else {
    		//	console.info('dealer to act: ' + this.hands(true)[0]);
    		//	if ( this.hands(true)[0].value() > 17 || ( this.hands(true)[0].value() == 17 && !this.hands(true)[0].hasAce() ) ) {
    		//		this.hands(true)[0].stay();
    		//	} else {
    		//		this.hands(true)[0].hit();
    		//	}
			//	var self = this;
			//	this.timer = setTimeout( function(){self.play()},1000);    			
    		//}
    	} else if ( this.bets() ) {
    		console.info('bets waiting');
    		var self = this;
    		this.timer = setTimeout( function(){self.deal()}, 1000);    		
    	} else if ( this.hands(false).length > 0 ) {
    		//console.info('hand to payout or collect: ' + this.hands(false)[0]);
    		//var self = this;
    		//this.payout( this.hands(false)[0] );
    		//this.hands(false)[0] = this.hands(false)[0].player; 
			//this.timer = setTimeout( function(){self.play()},2000);
    	} 
    }
    
    table.prototype.deal = function() {
    	if ( this.hands() ) {
    		console.info('actual deal');
    		for (var y = 1; y <= 2; y++ ) {
    			for (var x = 0; x < this.seats.length; x++) {
    				try {
    					if ( this.hand(x).cards.length < y ) {
    						console.info('card ' + y + ' to: ' + x);
    						this.hand(x).cards[this.hand(x).cards.length] = this.shoe.next();
    						var self = this;
    						self.timer = setTimeout( function(){self.deal()}, 1000);
    						return x;
    					}
    				} catch (err) {
    				}
    			}
    		}
    		
    		if ( this.seats[this.seats.length - 1].cards[0].card == 'A' ) {
    			this.insurance( this.seats[this.seats.length - 1].cards[1].bjValue() == 10 );
    		} else if ( this.seats[this.seats.length - 1].cards[0].bjValue() == 10 && this.seats[this.seats.length - 1].cards[1].card == 'A' ) {    			
    			console.info('backdoor blackjack');    			
    			for (var x = 0; x < this.seats.length; x++) {
    				try {
    					this.hand(x).stay();
    				} catch (err) {
    					console.info('err:' + err);
    				}
    			}    			    			
    			this.playAfter(3);    			    			
    		} else {
    			this.playAfter(3);
    		}
    		
    	} else {
	    	for (var x = 0; x < this.seats.length - 1; x++) {
	    		try {
	    			var b = this.bet(x);
	    			console.info("create bjhand");
	    			this.seats[x] = new bjhand( b, this.seats[x][0] );    		
	    		} catch (err) {
	    			//console.info('no bet:' + x);
	    		}
	    	}
	    	if ( this.hands() ) {
	        	console.info('create dealear hand');
	        	this.seats[this.seats.length - 1] = new bjhand(0);
	        	this.deal();
	    	}
    	}
	}

    table.prototype.toString = function() {    	
    	return 'seats:' + this.seats + ' shoe:' + this.shoe + ' min bet:' + this.minimum;
    }
    
    return table;
});